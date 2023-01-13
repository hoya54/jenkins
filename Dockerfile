FROM adoptopenjdk/openjdk11
ARG JAR_FILE=demo.jar
COPY ${JAR_FILE} demo.jar
ENTRYPOINT ["java", "-jar","/demo.jar"]
