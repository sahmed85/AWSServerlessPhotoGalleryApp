import json
import boto3  
import time
import datetime

REGION="us-east-1"
dynamodb = boto3.resource('dynamodb',region_name=REGION)
table = dynamodb.Table('PhotoGallery')

def lambda_handler(event, context):
    username=event['body-json']['username']
    title=event['body-json']['title']
    description=event['body-json']['description']
    tags=event['body-json']['tags']
    uploadedFileURL=event['body-json']['uploadedFileURL']
    ts=time.time()
    timestamp=int(ts*1000)
    photoID=str(timestamp)
    
    table.put_item(
    Item={                        
            "PhotoID": photoID,
            "Username": username,
            "CreationTime": timestamp,
            "Title": title,
            "Description": description,
            "Tags": tags,
            "URL": uploadedFileURL
            #"ExifData": ExifData
        }
    )
                
    return {
        "statusCode": 200,
        "body": json.dumps(photoID)
    }
    
    
    
