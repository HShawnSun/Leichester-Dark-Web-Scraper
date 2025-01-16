# Dark Web Scraper Backend

## Running

### Maven

To run the project from source:

```sh
./mvnw clean spring-boot:run
```

### JAR

To compile the project into a self-contained executabel JAR:

```sh
./mvnw clean package
```

This will output the JAR file in the `target` directory

Then run the JAR:

```sh
java -jar target/scraperBackend-{version}.jar
```

