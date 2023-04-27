import os
import requests
import json
import base64
import boto3
from time import sleep
from config import query

secret_client = boto3.client('secretsmanager')

def lambda_handler(event, context):

    appsync_endpoint = os.environ['APPSYNC_API_ENDPOINT']
    appsync_api_key_secret_arn = os.environ['APPSYNC_APIKEY_SECRET_ARN']
    appsync_api_key = get_appsync_api_key(appsync_api_key_secret_arn)
    
    appsync_header = {
        "Content-Type": "application/json",
        "x-api-key": appsync_api_key
    }

    try:
        if 'records' in event:
            records = event['records'].values()
        for record_data in records:
            kafka_payload = {
                'topic':record_data[0]['topic'],
                'value':base64.b64decode(record_data[0]['value']).decode('utf-8')
                
            }
            variables = {"channelName": record_data[0]['topic'], "testData": json.dumps(kafka_payload)}
            payload = {"query": query, 'variables': variables}
            response = requests.post(
                appsync_endpoint,
                json=payload,
                headers=appsync_header
            ).json()
            if 'errors' in response:
                print('Error attempting to query AppSync')
                print(response)
            else:
                return response
    except Exception as exception:
        print('Error with Mutation')
        print(exception)

    return None
    
def get_appsync_api_key(appsync_api_key_secret_arn):
    response = secret_client.get_secret_value(
        SecretId=appsync_api_key_secret_arn
    )
    secret_string = response['SecretString']
    secret_string = json.loads(secret_string)
    appSyncApiKey = secret_string['appSyncApiKey']
    return appSyncApiKey