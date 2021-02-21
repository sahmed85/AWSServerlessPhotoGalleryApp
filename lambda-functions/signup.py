import json
import boto3   
from botocore.exceptions import ClientError

REGION="us-east-1"
USER_POOL_ID="[INSERTHERE]"
CLIENT_ID="[INSERTHERE]"

cognitoclient = boto3.client('cognito-idp', region_name=REGION)
                            
def lambda_handler(event, context):
    username=event['body-json']['username']
    password=event['body-json']['password']
    name=event['body-json']['name']
    email=event['body-json']['email']
    result=False
    message=""
    response={}
    returndata={} 
    userdata={}
    
    try:
        response = cognitoclient.sign_up(
            ClientId=CLIENT_ID,
            Username=username,
            Password=password,
            UserAttributes=[
                {
                    'Name': 'name',
                    'Value': name
                },
                {
                    'Name': 'email',
                    'Value': email
                }
            ]
        )
        result=True
        message="Signup successful"
    
    except ClientError as e:
        if e.response['Error']['Code'] == 'UsernameExistsException':
            result=False
            message="User already exists"
        elif e.response['Error']['Code'] == 'ParamValidationError':
            result=False
            message="Param Validation Error"
        else:
            result=False
            message=e.response['Error']['Code']
    
    userdata['username']=username
    userdata['name']=name
    userdata['email']=email
    returndata['result']=result
    returndata['message']=message
    returndata['userdata']=userdata
    
    return {
        "statusCode": 200,
        "body": json.dumps(returndata)
    }