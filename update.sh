#!/bin/bash

no_color=$(echo -e "\033[0m")
yellow=$(echo -e "\033[1;33m")

NAME=note-light

echo -e "${yellow}Recovering Logs${no_color}"
docker logs "$NAME"

echo -e "${yellow}Stopping Server${no_color}"
docker compose down

echo -e "${yellow}Updating Server${no_color}"
docker compose pull

echo -e "${yellow}Restarting Server${no_color}"
docker compose up
