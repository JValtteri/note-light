#!/bin/bash

NUSER=note
NGROUPNAME=$NUSER
NUID=10011
NGID=20012

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
echo "name=$NUSER UID=$NUID : group=$NGROUPNAME GID=$NGID"
sudo addgroup \
    --gid "$NGID" \
    "$NGROUPNAME"
sudo adduser \
    --disabled-password \
    --gecos "" \
    --ingroup "$NGROUPNAME" \
    --no-create-home \
    --uid "$NUID" \
    $NUSER

echo -e "\n${yellow}Preparing mount folders${no_color}"
echo "./db/"
mkdir db
sudo chown -R "$NUSER":"$NGROUPNAME" db/
echo "./images/"
mkdir images
sudo chown -R "$NUSER":"$NGROUPNAME" images/
echo "./logo.png"
sudo chown "$NUSER":"$NGROUPNAME" logo.png

echo -e "\n${green}Setup Complete${no_color}"
echo -e "Customize the ${yellow}config.json${no_color} according to your preferences."

echo -e "\nStart the server with ${yellow}'run docker compose up'${no_color} and note down the generated admin password."
echo -e "Press ${yellow}D${no_color} to detach from the running container.\n"
