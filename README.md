## Real-time data distribution with Amazon MSK and AWS AppSync

_Editor's note: This solution was developed in collaboration with AWS APN Partner [NETSOL Technologies](https://netsolcloudservices.com/real-time-data-distribution-code-base/)._

Businesses and applications nowadays are expected to provide an engaging experience to users; hence real-time access to data is crucial. Technologies like WebSockets make it possible for various solutions, including live sports scores, chat applications, dashboards, and collaborative tools, to function efficiently by delivering real-time data updates to clients, a process that is significantly faster than client polling for new data. As the application's user base grows, manually managing a real-time backend that scales to meet user growth becomes cumbersome.

AWS AppSync provides the utility of GraphQL subscriptions to perform real-time operations by pushing data to clients that listen to specific events. Many backend services like AWS Managed Streaming for Apache Kafka (MSK) and AWS Lambda can be paired with AppSync. Connections, scalability, fan-out, and broadcasting are all handled by AppSync, allowing you to focus on your business use cases and requirements instead of dealing with the complex infrastructure required to manage Web Sockets connections at scale.

In this blog, we will discuss how to configure and utilize Amazon Managed Streaming for Apache Kafka (MSK) and AWS AppSync to distribute real-time stock ticker data to end users at scale. Users will be able to subscribe to multiple stocks and receive data for the subscribed stocks at real time with minimal latency. Amazon MSK partitions maintain FIFO order of the incoming stock data which gets distributed by AppSync in real time.

## Solution Architecture

![msk-appsync-solution-architecture](https://user-images.githubusercontent.com/1624530/235167527-1e5b260e-db04-4d92-8b8f-bf395aaea79c.png)

The following are descriptions of the numbered architectural features from the diagram:

1. MSK Producer lambda fetches data from data source after specific intervals and pushes the data in a specific MSK topic
2. AWS MSK ensures the order of the data inside each topic. For each topic a Consumer lambda is integrated to be triggered as soon as the data arrives.
3. MSK consumer performs required transformations and executes AppSync mutation with the transformed data
4. AWS AppSync subscription mapped to the executed mutation broadcasts data to all the connected clients

## Requirements

- [Create an AWS account](https://portal.aws.amazon.com/gp/aws/developer/registration/index.html) if you do not already have one and log in. The IAM user that you use must have sufficient permissions to make necessary AWS service calls and manage AWS resources.
- [Node and NPM](https://nodejs.org/en/download/) installed
- [Amplify CLI](https://docs.amplify.aws/cli/start/install/), only required to generate graphql code

## Configuration Steps

Following resources will be provisioned as part of CloudFormation template launch (Step 1 to 11):

1. Amazon VPC
2. IAM Roles for Lambda Functions
3. Custom KMS Key
4. Secret Manager Parameter for MSK
5. Amazon Managed Streaming for Apache Kafka (MSK)
6. Bastion Host
7. Configure Topics in MSK Cluster
8. AppSync API
9. Secret Manager Parameter for AppSync
10. Update IAM Role for Lambda Functions
11. Producer and Consumer Lambdas

To launch the CloudFormation template:

1. Use a git client to clone the project GitHub repository to a local directory.
2. In your AWS console, navigate to CloudFormation.
3. Click “Create stack” with new resources (standard).
4. Choose “Template is ready” and “Upload a template file”.
5. Select “Choose file” and upload the file amazon-msk-appsync-datadistribution.yml in your local project “cloudformation” directory.
6. Create a stack name (i.e. “NETSOL-Data-Distribution-Solution”)
7. Review the parameters and click “Next”.
8. Click the check box "I acknowledge that AWS CloudFormation might create IAM resources with customer names" then click “Submit”.

## Configure the React.js client Application

1. Clone the respository and Navigate into **react-client** directory

2. Install the project dependencies listed in package.json:

   ```sh
   npm install
   ```

3. Navigate into AWS AppSync console settings section and copy AppSync API details (API ID, API Key, GraphQL Endpoint URL) for the deployed API

4. In the current directory create  a file named `.env` and paste the following. Replace the corresponding values copied in previous step:

   ```sh
   REACT_APP_APPSYNC_URL={Replace graphql endpoint here}
   REACT_APP_APPSYNC_API_KEY={Replace api key here}
   ```

5. Generate the necessary code to interact with the API using the [Amplify CodeGen](https://docs.amplify.aws/cli/graphql-transformer/codegen/) with the API ID saved previously from the console. There's no need to create an Amplify CLI project. Execute the following command accepting all defaults:

   ```sh
   amplify add codegen --apiId {Replace api id here}
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

## Testing the solution
1. Log into the Access the AWS Management Console
2. Navigate to AWS Lambda Service
3. Locate the Lambda Functions with the name having following pattern:

   `${project}-${awsEnv}-producerLambdaFunction-${AWS::Region}`
   `${project}-${awsEnv}-producerLambdaFunction2-${AWS::Region}`

4. Open the Lambda function details page. Click on the `Test` button.
5. In the `Configure test event` pop up, select an existing test event or create a new one with default settings.
6. Once a test event is selected or created, click the `Test` button to invoke the Lambda function.
8. Repeat for steps 4 to 6 for the Second Lambda Function as well
9. Open the react application accessible at http://localhost:3000 to receive data from appsync.


## Sending Data from MSK to AppSync using Python
<br>

### Code Explanation:

The code snippet below demonstrates how to prepare and execute a mutation request to send data from an MSK topic to an AppSync API using Python's requests library.

<br>

### Setting Up Header and Payload:
<br>
The following Python code sets up the necessary header containing the AppSync API key for authentication and constructs the payload, which contains the data sent by MSK topic, to be sent in the mutation.

   ```sh
   appsync_header = {
        "Content-Type": "application/json",
        "x-api-key": appsync_api_key
    }
   kafka_payload = {
                'topic': record_data[0]['topic'],
                'value': base64.b64decode(record_data[0]['value']).decode('utf-8')
            }
   variables = {
             "channelName": record_data[0]['topic'], "testData": json.dumps(kafka_payload)}
   query = """
    mutation publishData($channelName: String!, $testData: AWSJSON!){
        publish(name:$channelName, data: $testData) {
            data
            name
        }
    }"""
   payload = {"query": query, 'variables': variables}
   ```

### Executing the Mutation:
<br>
Once the header and payload are prepared, the mutation is invoked by making a POST request to the AppSync endpoint with the defined header and payload.

   ```sh
   response = requests.post(
      appsync_endpoint,
      json=payload,
      headers=appsync_header
   ).json()

   ```

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
