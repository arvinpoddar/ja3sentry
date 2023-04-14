# Verifier Lambda

An Node.js Express REST API that supports two endpoints:

- `POST /api/verify`: Check a collection of JA3s against a database of *known threat* JA3 hashes
- `POST /api/potential-threat`: Add a JA3 to a database table of *potentially* risky client signatures

All data is persisted to a PostgreSQL database.

The verifier also includes the script used to populate the database with the initial CSV database. These are available under `/populate`

# Installation and Setup
1. Install dependencies:
```
yarn install
```

2. Set environment variables in a new `.env` file:
```
DB_HOST=xxx
DB_PORT=xxx
DB_USER=xxx
DB_PASSWORD=xxx
DB_NAME=xxx

APPLICATION_PORT=xxx
```

3. Run the app:
```
node app.js
```

# Deploying to AWS Lambda
Follow these steps to deploy the Verifier to AWS Lambda
1. Create a new Lambda function from the console
2. Compress everything in this directory (except the `populate` subdirectory) into a ZIP archive
3. Upload the ZIP to our Lambda. 
4. Configure the Lambda handler (under **Code > Runtime Settings**) to be `lambda.handler` instead of the default `index.handler`
5. Set the same environment variables as above under the **Configuration > Environment variables** section
6. Under **Configuration > Function URL**, enable the URL and make sure the URL is public.
7. When you visit this URL, you should see a success message.
