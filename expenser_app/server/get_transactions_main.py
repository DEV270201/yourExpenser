import json
import boto3
from boto3.dynamodb.conditions import Key
from botocore.config import Config
retry_config = Config(
    retries = {
        'max_attempts': 3,
        'mode': 'standard'
    }
)

def lambda_handler(event, context):
    print("event: ", event)
    dynamodb = boto3.resource('dynamodb', config=retry_config)
    table = dynamodb.Table('Expenser_App')
    
    #getting all the paramters for the api call
    user_id = event['pathParameters']['user_id']
    type_ = event['queryStringParameters']['type']
    start_date = event['queryStringParameters']['start_date']
    end_date = event['queryStringParameters']['end_date']
    
    #generated PK and SK for the table as required for the query
    partition_key = f"USER:{user_id}"
    start_sort_key = f"{type_.upper()}:{start_date}"
    end_sort_key = f"{type_.upper()}:{end_date}"

    if type_ == 'all':
       start_sort_key = f"EXPENSE:{start_date}"
       end_sort_key = f"INCOME:{end_date}"

    try:
        resp = table.query(
            IndexName="Expenser_GSI1",
            KeyConditionExpression=Key('GSI1_PK').eq(partition_key) & Key('GSI1_SK').between(start_sort_key, end_sort_key)
        )

        print("main transactions response: ", resp)
        items = resp.get('Items', [])
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
            },
            "body": json.dumps({
                "transactions": items,
                "success": True
            }, default=float)
        }
    except Exception as e:
        error_code = e.response.get('Error', {}).get('Code') if hasattr(e, 'response') else "UnknownError"

        log_payload = {
                "level": "ERROR",
                "message": "Transactions unavailable!",
                "user_id": partition_key,
                "error_code": error_code,
                "error_detail": str(e),
            }
        
        print(json.dumps(log_payload))

        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
            },
            "body": json.dumps({
                "message": "Internal server error",
                "success": False
            })
        }

