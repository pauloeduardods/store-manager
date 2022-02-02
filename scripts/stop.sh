#!/bin/bash

echo "Stopping the application"

docker ps --filter name=store-manager-api -aq | xargs docker stop
docker container prune -f
docker image prune -af