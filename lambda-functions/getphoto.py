import json
import boto3  
from boto3.dynamodb.conditions import Key, Attr

REGION="us-east-1"
dynamodb = boto3.resource('dynamodb',region_name=REGION)
table = dynamodb.Table('PhotoGallery')

def lambda_handler(event, context):
    photoID=event['params']['path']['id']

    tableItems = table.scan(
        FilterExpression=Attr('PhotoID').eq(str(photoID))
    )

    items = tableItems['Items']

    response = {
        "statusCode": 200,
        "body": items,
    }

    return response
    
    
    
