# Use official .NET 9 SDK as base image
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy the project files
COPY . ./

# Restore dependencies
RUN dotnet restore

# Build the application
RUN dotnet publish -c Release -o /app/publish

# Use a runtime image for final execution
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Copy built files
COPY --from=build /app/publish .

# Set environment variables
ENV ASPNETCORE_ENVIRONMENT=Production

# Expose the API port
EXPOSE 8080

# Run the application
ENTRYPOINT ["dotnet", "DigitalWallet.dll"]
