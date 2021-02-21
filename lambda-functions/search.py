import json
import boto3  
import time
from boto3.dynamodb.conditions import Key, Attr

REGION="us-east-1"
dynamodb = boto3.resource('dynamodb',region_name=REGION)
table = dynamodb.Table('PhotoGallery')

def lambda_handler(event, context):
    query = event['body-json']['query'] 
        
    response = table.scan(
            FilterExpression=Attr('Title').contains(str(query)) | Attr('Description').contains(str(query)) | Attr('Tags').contains(str(query))
        )

    items = response['Items']
                
    return {
        "statusCode": 200,
        "body": items
    }
    
    
    
