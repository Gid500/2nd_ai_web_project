# Stage 1: Build with Gradle
FROM gradle:8.5.0-jdk17-jammy AS build

WORKDIR /home/gradle/src

# Copy gradle wrapper
COPY gradlew .
COPY gradle ./gradle

# Copy build and settings files
COPY build.gradle .
COPY settings.gradle .

# Make gradlew executable
RUN chmod +x ./gradlew

# Copy the rest of the source code
COPY src ./src

# Build the application
RUN ./gradlew build -x test

# Stage 2: Run the application
FROM eclipse-temurin:17-jdk-focal

WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /home/gradle/src/build/libs/lastdance-0.0.1-SNAPSHOT.jar .

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "lastdance-0.0.1-SNAPSHOT.jar"]
