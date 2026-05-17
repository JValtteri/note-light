#!/bin/bash

USER=note
GROUPNAME=$USER
UID=10011
GID=20012

no_color=$(echo -e "\033[0m")
yellow=$(echo -e "\033[1;33m")

echo -e "${yellow}Setup script for initial setup of Note-Light. ${no_color}\nPress Ctrl+C to cancel"
sleep 1

echo -e "\n${yellow}Copying Files...${no_color}"
echo "docker-compose.yml"
curl -O "https://raw.githubusercontent.com/JValtteri/note-light/refs/heads/main/docker-compose.yml"
echo "config.json"
curl -o ./config.json "https://raw.githubusercontent.com/JValtteri/note-light/refs/heads/main/server/config.json.example"
echo "update.sh"
curl -O "https://raw.githubusercontent.com/JValtteri/note-light/refs/heads/main/update.sh"
chmod +x update.sh
echo "logo.png"
curl -O "https://raw.githubusercontent.com/JValtteri/qure/note-light/heads/main/client/public/logo.png"

echo -e "\n${yellow}Creating Dedicated User${no_color}"
echo "name=$USER UID=$UID"
addgroup \
    --gid "$GID" \
    "$GROUPNAME" \
&& adduser \
    --disabled-password \
    --gecos "" \
    --ingroup "$GROUPNAME" \
    --no-create-home \
    --uid "$UID" \
    $USER

echo -e "\n${yellow}Preparing mount folders${no_color}"
echo "./db/"
mkdir db
sudo chown -R $USER db/
echo "./images/"
mkdir images
sudo chown -R $USER images/

echo -e "\n${green}Setup Complete${no_color}"
echo -e "Customize the ${yellow}config.json${no_color} according to your preferences."

echo -e "\nStart the server with ${yellow}'run docker compose up'${no_color} and note down the generated admin password."
echo -e "Press ${yellow}D${no_color} to detach from the running container.\n"
