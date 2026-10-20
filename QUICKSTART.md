# Quick Start Guide - Docker Setup

Get your TiruDesigns development environment running in minutes!

## 🚀 One Command Setup

```bash
pnpm docker:up
```

That's it! Wait 2-3 minutes for everything to start.

## 🌐 Access Your Applications

Once services are running:

| Service | URL | Description |
|---------|-----|-------------|
| **Client** | http://localhost:5173 | Main user interface |
| **Backoffice** | http://localhost:5174 | Admin dashboard |
| **API** | http://localhost:4001 | Backend API |
| **MinIO Console** | http://localhost:9001 | File storage management |

### MinIO Login
- Username: `minioadmin`
- Password: `minioadmin`

## 📊 Check Status

```bash
# View all running services
docker-compose ps

# View live logs
pnpm docker:logs

# View logs for specific service
docker-compose logs -f client
docker-compose logs -f api
```

## 🛑 Stop Services

```bash
pnpm docker:down
```

## 🔄 Restart After Changes

```bash
# Rebuild and restart (after package.json changes)
pnpm docker:build
pnpm docker:up

# Just restart (code changes auto-reload)
pnpm docker:restart
```

## 🗄️ Database Commands

```bash
# Run migrations
docker-compose exec api pnpm --filter @tirudesign/api-app prisma migrate dev

# Open Prisma Studio
docker-compose exec api pnpm --filter @tirudesign/api-app prisma studio

# Reset database (WARNING: deletes all data)
docker-compose exec api pnpm --filter @tirudesign/api-app prisma migrate reset
```

## 🧹 Clean Everything

Remove all containers, volumes, and data:

```bash
pnpm docker:clean
```

## ❓ Troubleshooting

### "Port already in use" error

Check what's using the port:
```bash
# Check ports
netstat -an | findstr "5173"
```

Stop the conflicting service or change the port in `docker-compose.yml`.

### Services not starting

```bash
# Check logs
pnpm docker:logs

# Restart specific service
docker-compose restart api
```

### Code changes not reflecting

1. Check that the service is running: `docker-compose ps`
2. Check logs for errors: `docker-compose logs -f client`
3. For package changes, rebuild: `pnpm docker:build && pnpm docker:up`

### Database connection failed

Wait 30 seconds for PostgreSQL to fully initialize on first run.

## 📚 More Information

See [DOCKER.md](./DOCKER.md) for detailed documentation.

## 🎯 Development Workflow

1. **Start services**: `pnpm docker:up`
2. **Make code changes** - auto-reload works!
3. **View logs**: `pnpm docker:logs`
4. **Stop services**: `pnpm docker:down`

## 💡 Tips

- **First run takes longer** - Docker downloads images and builds containers
- **Hot reload works** - Code changes reflect immediately (no rebuild needed)
- **Data persists** - Stopping services doesn't delete data
- **Clean slate**: Use `pnpm docker:clean` to start fresh

## 🐳 Docker Cheat Sheet

```bash
# Start services
pnpm docker:up

# Stop services
pnpm docker:down

# View logs
pnpm docker:logs

# Rebuild images
pnpm docker:build

# Restart services
pnpm docker:restart

# Remove everything
pnpm docker:clean
```

Happy coding! 🎉
