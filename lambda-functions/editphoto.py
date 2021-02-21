import json
import boto3  
from botocore.exceptions import ClientError

REGION="us-east-1"
dynamodb = boto3.resource('dynamodb', region_name=REGION)
table = dynamodb.Table('PhotoGallery')

def lambda_handler(event, context):
    # Photo ID passed in the API link
    photoID_str=str(event['params']['path']['id'])
    photoID_num=int(event['params']['path']['id'])
    # JSON data that will be needed to update the table
    title=event['body-json']['title']
    description=event['body-json']['description']
    tags=event['body-json']['tags']
    try:
        del_response = table.update_item(
            Key={
                'PhotoID': photoID_str,
                'CreationTime':photoID_num
            },
            UpdateExpression ="SET Description=:description, Tags=:tags, Title=:title",
            ExpressionAttributeValues={
                ':description': description,
                ':tags': tags,
                ':title': title
            }
        )
        response = {
            "statusCode": 200,
            "body": del_response,
        }
        return response
    except ClientError as e:
        response = {
            "statusCode": 200,
            "body": e.response['Error']['Message'],
        }
        return response


