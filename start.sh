#!/bin/bash

# Railway startup script for ZooPark monorepo
set -e

echo "Starting ZooPark application..."

# Set default environment variables if not set
export SPRING_PROFILES_ACTIVE=${SPRING_PROFILES_ACTIVE:-prod}
export JAVA_OPTS=${JAVA_OPTS:-"-Xmx512m -Xms256m"}

# Create uploads directory if it doesn't exist
mkdir -p uploads

# For Railway, we'll run only the backend since frontend is handled separately
if [ -f "backend/target/*.jar" ]; then
    echo "Starting Spring Boot backend..."
    java $JAVA_OPTS -jar backend/target/*.jar
else
    echo "Backend JAR not found. Building application..."
    cd backend

    # Use Maven wrapper if available
    if [ -f "mvnw" ]; then
        ./mvnw clean package -DskipTests
    else
        mvn clean package -DskipTests
    fi

    echo "Starting Spring Boot backend..."
    java $JAVA_OPTS -jar target/*.jar
fi
