APP_NAME := task-manager
GITHUB_URL := https://github.com/KarthikaRajendran11/TaskManager.git

.PHONY: up 

COMPOSE := docker-compose $(COMPOSE_OPTS)

up:
	$(COMPOSE) up