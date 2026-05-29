FROM --platform=$BUILDPLATFORM eclipse-temurin:24-jdk-alpine AS build
WORKDIR /app
COPY . .
RUN chmod +x ./mvnw && sed -i 's/\r$//' ./mvnw
ENV MAVEN_OPTS="-Xmx1024m -XX:+UseSerialGC"
RUN ./mvnw clean package -DskipTests

FROM --platform=linux/amd64 eclipse-temurin:24-jre-alpine
WORKDIR /app
COPY --from=build /app/target/server-1.0.0.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]