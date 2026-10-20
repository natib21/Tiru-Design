# Docker Port Conflict Diagnosis Report

## Summary

The Docker Compose setup encountered **port conflicts** due to local development servers already running on the host machine.

---

## Root Cause Analysis

### Issue #1: API Port Conflict (Port 4000) ✅ FIXED

**Problem:**
- Docker Compose was configured to map API to host port 4000
- Local Node.js process (PID 29828) was already using port 4000
- Docker error: `listen tcp 0.0.0.0:4000: bind: Only one usage of each socket address is normally permitted`

**Investigation:**
- Checked `apps/api/.env` → Found `API_PORT=4001`
- Checked `apps/client/.env` → Found `VITE_API_BASE_URL=http://localhost:4001/api`
- **Conclusion:** The TiruDesign architecture EXPECTS the API on port **4001**, not 4000

**Solution Applied:**
- Changed docker-compose.yml API port mapping from `4000:4000` to `4001:4000`
  - **Host port:** 4001 (externally accessible)
  - **Container internal port:** 4000 (unchanged - app still listens on 4000 inside container)
- Updated frontend environment variables to use `http://localhost:4001`
- Updated documentation files (DOCKER.md, QUICKSTART.md, .env.docker)

---

### Issue #2: Client Port Conflict (Port 5173) ⚠️ REQUIRES ACTION

**Problem:**
- Docker Compose is configured to map Client to host port 5173
- Local Node.js process (PID 13440) is already using port 5173
- Docker error: `listen tcp 0.0.0.0:5173: bind: Only one usage of each socket address is normally permitted`

**Two Options:**

#### Option A: Stop Local Dev Servers (Recommended)
Stop your local development servers before running Docker Compose:

```powershell
# Find the processes
Get-Process -Id 29828, 13440

# Stop them (you can also use Task Manager or Ctrl+C in their terminals)
Stop-Process -Id 29828, 13440
```

Then run:
```powershell
pnpm docker:up
```

#### Option B: Change Docker Client Port
If you want to keep local dev servers running alongside Docker:

**Change client port to 5175:**
- Edit `docker-compose.yml`, client service: `"5175:5173"`
- Access client at http://localhost:5175 instead

**Change backoffice port to 5176:**
- Edit `docker-compose.yml`, backoffice service: `"5176:5173"`
- Access backoffice at http://localhost:5176 instead

---

### Issue #3: API Container Dependency Issue ⚠️ NEEDS INVESTIGATION

**Problem:**
The API container is failing to start with:
```
Error: Cannot find module '/app/apps/api/node_modules/ts-node-dev/lib/bin.js'
```

**Possible Causes:**
1. Dependencies not installed in Docker image (missing `pnpm install`)
2. Volume mount issue preventing access to node_modules
3. Build cache issue

**Recommended Solutions:**
1. Rebuild images from scratch:
   ```powershell
   docker compose build --no-cache
   ```

2. If that doesn't work, check the Dockerfile's dependency installation step

---

## Configuration Changes Made

### Files Modified:

1. **docker-compose.yml**
   - API port mapping: `4000:4000` → `4001:4000`
   - Client environment: `VITE_API_URL=http://localhost:4001`
   - Backoffice environment: `VITE_API_URL=http://localhost:4001`

2. **.env.docker**
   - Updated `VITE_API_URL=http://localhost:4001`

3. **DOCKER.md**
   - Updated API port from 4000 to 4001 in service list
   - Updated "Accessing Services" section

4. **QUICKSTART.md**
   - Updated API port from 4000 to 4001 in URLs table

---

## Architecture Summary

| Service | Container Port | Host Port | URL |
|---------|---------------|-----------|-----|
| PostgreSQL | 5432 | 5432 | localhost:5432 |
| Redis | 6379 | 6379 | localhost:6379 |
| MinIO API | 9000 | 9000 | http://localhost:9000 |
| MinIO Console | 9001 | 9001 | http://localhost:9001 |
| **API** | **4000** | **4001** | **http://localhost:4001** |
| Client | 5173 | 5173 | http://localhost:5173 |
| Backoffice | 5173 | 5174 | http://localhost:5174 |

**Key Points:**
- Container internal ports remain unchanged (apps don't need reconfiguration)
- Host ports changed to avoid conflicts with local dev servers
- Frontends configured to communicate with API via host port 4001

---

## Next Steps

1. **Stop local development servers** (PIDs 29828, 13440)
2. **Rebuild Docker images:**
   ```powershell
   pnpm docker:build --no-cache
   ```
3. **Start services:**
   ```powershell
   pnpm docker:up
   ```
4. **Verify all services:**
   ```powershell
   docker compose ps
   ```

---

## Port Conflict Checklist

Before running Docker Compose, verify these ports are free:

```powershell
netstat -ano | findstr ":4001 :5173 :5174 :5432 :6379 :9000 :9001"
```

If any ports are in use:
- Identify the process: `Get-Process -Id <PID>`
- Stop it: `Stop-Process -Id <PID>`
- Or use Task Manager to end the process

---

## Verification Commands

After successful startup:

```powershell
# Check all services are running
docker compose ps

# Verify API is accessible
curl http://localhost:4001/api

# Check logs
docker compose logs api
docker compose logs client
docker compose logs backoffice

# Health checks
docker compose ps | findstr healthy
```

Expected output:
- ✅ PostgreSQL: healthy
- ✅ Redis: healthy
- ✅ MinIO: healthy
- ✅ API: running (after dep fix)
- ✅ Client: running
- ✅ Backoffice: running

---

## Important Notes

1. **Do NOT change container internal ports** - apps are configured to use specific ports internally
2. **Only change host-side port mappings** to avoid conflicts
3. **Local .env files** expect API on port 4001, matching Docker setup
4. **CORS configuration** in API includes both frontend ports (5173, 5174)

