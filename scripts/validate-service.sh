echo "Delete unused images and containers"

docker container prune -f
docker image prune -fa

echo "Checking if application is running"

if [ "$(docker container inspect -f '{{.State.Status}}' store-manager-api_backend_1)" == "running" ] && [ "$(docker container inspect -f '{{.State.Status}}' store-manager-api_db_1)" == "running" ]; then
  echo "Application is running"
  exit 0
else
  echo "Application is not running"
  exit 1
fi