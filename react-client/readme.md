# Serverless Real-Time API (WebSockets)<br/> with AWS AppSync
<br/>

## Requirements

* [Create an AWS account](https://portal.aws.amazon.com/gp/aws/developer/registration/index.html) if you do not already have one and log in. The IAM user that you use must have sufficient permissions to make necessary AWS service calls and manage AWS resources.
* [Node and NPM](https://nodejs.org/en/download/) installed
* [Amplify CLI](https://docs.amplify.aws/cli/start/install/), only required to generate graphql code
<br/>
<br/>

## Configure the React.js client

1. Install the project dependencies:

   ```sh
   npm install
   ```
2. Copy Appsync API details (API Id, API key, API url) from the settings section of the deployed API inside aws appsync console

3. Open the file `.env` and update the AppSync API configuration details based on the values copied above.

4. Name of the channels are already defined in `src/constants.js`. Same channel names will be used when sending data from backend source

5. Generate the necessary code to interact with the API using the [Amplify CodeGen](https://docs.amplify.aws/cli/graphql-transformer/codegen/) with the API ID saved previously from the console. There's no need to create an Amplify CLI project. Execute the following command accepting all defaults:

   ```sh
   amplify add codegen --apiId xxxxxxxxxxxxxxxxxxxxxx
   ```
6. Verify that **graphql** folder is created inside **src** folder, containing following files:
   ```
   mutations.js
   queries.js
   subscriptions.js
   ```
7. Execute the application and access at http://localhost:3000:

    ```bash
    npm start
    ```
