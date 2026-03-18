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
    type_ = event['queryStringParameters'].get('type', 'inc')
    month_year = event['queryStringParameters'].get('month_year', None)
    start_date = event['queryStringParameters'].get('start_date',None)
    end_date = event['queryStringParameters'].get('end_date', None)

    print("start date: ", start_date)
    print("end date: ", end_date)
    
    #generated PK and SK for the table as required for the query
    partition_key = f"USER:{user_id}"

    try:
        items = []
        summary = {}
        resp = ""
        if start_date and end_date:
            start_sort_key = f"{type_.upper()[:3]}:{start_date}"
            end_sort_key = f"{type_.upper()[:3]}:{end_date}"

            if type_ == 'all':
                start_sort_key = f"EXP:{start_date}"
                end_sort_key = f"INC:{end_date}"

            resp = table.query(
                        IndexName="Expenser_GSI1",
                        KeyConditionExpression=Key('GSI1_PK').eq(partition_key) & Key('GSI1_SK').between(start_sort_key, end_sort_key)
                    )
        
            items = resp.get('Items', [])

        elif month_year:
            sort_key = f"SUMMARY:{month_year}"
            resp = table.get_item(
            Key={
                'PK': partition_key,
                'SK': sort_key
            }
            )
            summary = resp.get('Item', {})

        print("main transactions response: ", resp)

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': 'http://localhost:5173',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,DELETE'
            },
            "body": json.dumps({
                "transactions": items,
                "summary": summary,
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

