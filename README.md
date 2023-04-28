## Real-time data distribution with Amazon MSK and AWS AppSync

Businesses and applications nowadays are expected to provide an engaging experience to users; hence real-time access to data is crucial. Technologies like WebSockets make it possible for various solutions, including live sports scores, chat applications, dashboards, and collaborative tools, to function efficiently by delivering real-time data updates to clients, a process that is significantly faster than client polling for new data. As the application's user base grows, manually managing a real-time backend that scales to meet user growth becomes cumbersome.

AWS AppSync provides the utility of GraphQL subscriptions to perform real-time operations by pushing data to clients that listen to specific events. Many backend services like AWS Managed Streaming for Apache Kafka (MSK) and AWS Lambda can be paired with AppSync. Connections, scalability, fan-out, and broadcasting are all handled by AppSync, allowing you to focus on your business use cases and requirements instead of dealing with the complex infrastructure required to manage Web Sockets connections at scale.

In this blog, we will discuss how to configure and utilize Amazon Managed Streaming for Apache Kafka (MSK) and AWS AppSync to distribute real-time stock ticker data to end users at scale. Users will be able to subscribe to multiple stocks and receive data for the subscribed stocks at real time with minimal latency. Amazon MSK partitions maintain FIFO order of the incoming stock data which gets distributed by AppSync in real time.

## Solution Architecture

![msk-appsync-solution-architecture](https://user-images.githubusercontent.com/1624530/235167527-1e5b260e-db04-4d92-8b8f-bf395aaea79c.png)

The following are descriptions of the numbered architectural features from the diagram:
1.	MSK Producer lambda fetches data from data source after specific intervals and pushes the data in a specific MSK topic
2.	AWS MSK ensures the order of the data inside each topic. For each topic a Consumer lambda is integrated to be triggered as soon as the data arrives.
3.	MSK consumer performs required transformations and executes AppSync mutation with the transformed data
4.	AWS AppSync subscription mapped to the executed mutation broadcasts data to all the connected clients

## Requirements

* [Create an AWS account](https://portal.aws.amazon.com/gp/aws/developer/registration/index.html) if you do not already have one and log in. The IAM user that you use must have sufficient permissions to make necessary AWS service calls and manage AWS resources.
* [Node and NPM](https://nodejs.org/en/download/) installed
* [Amplify CLI](https://docs.amplify.aws/cli/start/install/), only required to generate graphql code

## Configuration Steps
To setup the solution discussed above you will need to provision following resources:
1.	Setup Amazon VPC
2.	Setup IAM Roles for Lambda Functions
3.	Setup Custom KMS Key
4.	Setup Secret Manager Parameter for MSK
5.	Setup Amazon Managed Streaming for Apache Kafka (MSK)
6.	Setup Bastion Host
7.	Configure Topics in MSK Cluster
8.	Setup AppSync API
9.	Setup Secret Manager Parameter for AppSync
10.	Update IAM Role for Lambda Functions
11.	Setup Producer and Consumer Lambdas
12.	Setup React application on AWS S3

We provide a cloud formation template to provision the first 11 steps.

To launch the CloudFormation template:
1.	Use a git client to clone the project GitHub repository to a local directory.
2.	In your AWS console, navigate to CloudFormation.
3.	Click “Create stack” with new resources (standard).
4.	Choose “Template is ready” and “Upload a template file”.
5.	Select “Choose file” and upload the file amazon-msk-appsync-datadistribution.yml in your local project “cloudformation” directory.
6.	Create a stack name (i.e. “NETSOL-Data-Distribution-Solution”)
7.	Review the parameters and click “Next”.
8.	Click the check box "I acknowledge that AWS CloudFormation might create IAM resources with customer names" then click “Submit”.

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
    
## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.

