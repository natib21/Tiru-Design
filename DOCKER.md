# Docker Setup Guide

This guide explains how to run TiruDesigns using Docker Compose.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

## Services

The docker-compose setup includes:

- **PostgreSQL** (port 5432) - Database
- **Redis** (port 6379) - Cache & Queue
- **MinIO** (ports 9000, 9001) - S3-compatible object storage
- **API** (port 4001) - NestJS backend
- **Client** (port 5173) - User-facing frontend
- **Backoffice** (port 5174) - Admin frontend

## Quick Start

### 1. Start All Services

```bash
pnpm docker:up
```

This will start all services in detached mode. First run will take longer as it builds the Docker images.

### 2. View Logs

```bash
pnpm docker:logs
```

Or view specific service logs:

```bash
docker-compose logs -f api
docker-compose logs -f client
docker-compose logs -f backoffice
```

### 3. Stop All Services

```bash
pnpm docker:down
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm docker:up` | Start all services in background |
| `pnpm docker:down` | Stop all services |
| `pnpm docker:logs` | View logs from all services |
| `pnpm docker:build` | Rebuild Docker images |
| `pnpm docker:clean` | Stop services and remove volumes (clears data) |
| `pnpm docker:restart` | Restart all services |

## Accessing Services

- **Client Frontend**: http://localhost:5173
- **Backoffice Frontend**: http://localhost:5174
- **API Backend**: http://localhost:4001
- **MinIO Console**: http://localhost:9001 (login: minioadmin/minioadmin)
- **PostgreSQL**: localhost:5432 (user: tirudesign, password: tirudesign_dev_password)
- **Redis**: localhost:6379

## Database Migrations

To run Prisma migrations inside the Docker container:

```bash
docker-compose exec api pnpm --filter @tirudesign/api-app prisma migrate dev
```

## Troubleshooting

### Services won't start

1. Check if ports are already in use:
   ```bash
   netstat -an | findstr "5173 5174 4000 5432 6379 9000"
   ```

2. Stop conflicting services or change ports in `docker-compose.yml`

### Database connection issues

- Wait for PostgreSQL to be fully ready (check logs: `docker-compose logs postgres`)
- Verify DATABASE_URL in the API service matches PostgreSQL credentials

### Hot reload not working

- Ensure volumes are properly mounted in docker-compose.yml
- On Windows, you may need to enable file sharing in Docker Desktop settings

### Rebuild after dependency changes

```bash
pnpm docker:build
pnpm docker:up
```

### Clear all data and start fresh

```bash
pnpm docker:clean
pnpm docker:up
```

## Development Notes

- **Hot Reload**: All frontends and backend have hot reload enabled
- **Volume Mounts**: Source code is mounted, so changes reflect immediately
- **Data Persistence**: Database and storage data persist in Docker volumes
- **Network**: All services communicate via the `tirudesign-network` bridge

## Production Deployment

This docker-compose.yml is configured for **development only**. For production:

1. Use multi-stage builds for smaller images
2. Don't mount source code as volumes
3. Use environment variables for secrets
4. Configure proper security settings
5. Use a managed database service instead of containerized PostgreSQL
6. Implement proper logging and monitoring

## Environment Variables

API environment variables can be configured in the `docker-compose.yml` file under the `api` service. Default values are set for local development.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `S3_ENDPOINT` - MinIO endpoint URL
- `CORS_ORIGINS` - Allowed CORS origins

## MinIO Setup

The setup automatically creates a bucket named `tirudesign` with public access. Access the MinIO console at http://localhost:9001 to manage buckets and files.

Default credentials:
- Access Key: `minioadmin`
- Secret Key: `minioadmin`

**Note**: Change these credentials for production use!
