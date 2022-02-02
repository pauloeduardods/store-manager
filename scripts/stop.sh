#!/bin/bash

echo "Stopping the application"

docker container stop "$(docker ps --filter name=store-manager-api* -aq)"
docker container prune -filter
docker image prune -af