import json
import boto3  
from botocore.exceptions import ClientError

REGION="us-east-1"
dynamodb = boto3.resource('dynamodb', region_name=REGION)
table = dynamodb.Table('PhotoGallery')
# s3client = boto3.client('s3')

def lambda_handler(event, context):
    photoID_str=str(event['params']['path']['id'])
    photoID_num=int(event['params']['path']['id'])
    try:
        # deleting the object on S3 is not implement, it needs an additonal role/security configs
        # this code would allow us to delete if that is set

        # query = table.get_item(
        #     Key={
        #         'PhotoID': photoID_str,
        #         'CreationTime':photoID_num
        #     }
        # )
        # s3_URL = query['Item']['URL']
        # s3_URL = s3_URL[s3_URL.find('/photos/')+1:]
        # s3client.delete_object(Bucket='photobucket-ahmed-2021-4150',Key=s3_URL)

        del_response = table.delete_item(
            Key={
                'PhotoID': photoID_str,
                'CreationTime':photoID_num
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


