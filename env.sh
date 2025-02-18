 export $(grep -v '^#' .env | xargs)


 export ASPNETCORE_ENVIRONMENT=Development


docker run --rm <image_name> cat /app/appsettings.json