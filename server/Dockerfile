FROM eclipse-temurin:24-jdk-alpine
WORKDIR /app
COPY server/target/server-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]