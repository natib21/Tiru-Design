DOCKER = docker compose

.PHONY: dev test prod-up prod-down

dev:
	$(DOCKER) -f docker-compose.yml -f docker-compose.override.yml --env-file .env.dev up --build

test:
	$(DOCKER) -f docker-compose.yml -f docker-compose.test.yml --env-file .env.test up --build --abort-on-container-exit --exit-code-from api

prod-up:
	$(DOCKER) -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.prod up --build -d

prod-down:
	$(DOCKER) -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.prod down
