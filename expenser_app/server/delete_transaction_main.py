import json
import boto3
from botocore.config import Config
config = Config(
    connect_timeout=3,  # Seconds to wait to establish a connection
    read_timeout=9,    # Seconds to wait for a response after sending request
    retries={'max_attempts': 3, 'mode': 'standard'}
)

def lambda_handler(event, context):
     
    dynamodb = boto3.client('dynamodb', config=config)
    table_name = 'Expenser_App'

    user_id = event['pathParameters']['user_id']
    trans_id = event['pathParameters']['trans_id']

    partition_key = f"TRANS:{trans_id}"
    sort_key = f"DATA"
    user_key = f"USER:{user_id}"

    try:
        # 1. Fetch the existing record to get the values for subtraction
        resp = dynamodb.get_item(
            TableName=table_name,
            Key={'PK': {'S': partition_key}, 'SK': {'S': sort_key}}
        )

        if 'Item' not in resp:
            return { 
            'statusCode': 404,
            'headers': {
                'Content-Type': 'application/json'
            }, 
            'body': json.dumps({"message": "Transaction not found", "success": False})}

        
        date = resp['Item']['Date']['S']
        trans_type = resp['Item']['Type']['S'].lower()
        category = resp['Item']['Category']['S']
        amount = resp['Item']['Value']['N']

        dynamodb.transact_write_items(
            TransactItems=[
                {
                    'Delete': {
                        'TableName': 'Expenser_App',
                        'Key': {'PK': {'S': partition_key}, 'SK': {'S': sort_key}}
                    }
                },
                {
                    'Update': {
                        'TableName': 'Expenser_App',
                        'Key': {'PK': {'S': user_key}, 'SK': {'S': f"SUMMARY:{date[:7]}"}},
                        # Subtracting the value from both the Type total and Category total
                        'UpdateExpression': "SET #t = #t - :val, #c = #c - :val",
                        'ExpressionAttributeNames': {
                            '#t': trans_type,
                            '#c': f"{trans_type[:3]}:{category}"
                        },
                        'ExpressionAttributeValues': {
                            ':val': {'N': amount}
                        }
                    }
                }
            ]
        )

        log_payload = {
                "level": "SUCCESS",
                "message": "Transaction deleted successfully",
                "user_id": f"USER:{user_id}",
                "transaction_id": partition_key,
            }

        print(json.dumps(log_payload))

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:5173',
                'Access-Control-Allow-Methods': 'OPTIONS,DELETE'
            },
            'body': json.dumps({"message": 'Transaction Deleted!', "success": True})
        }
    
    except Exception as e:
        error_code = e.response.get('Error', {}).get('Code') if hasattr(e, 'response') else "UnknownError"

        log_payload = {
                "level": "CRITICAL",
                "message": "Delete transaction failed after all retries",
                "user_id": f"USER:{user_id}",
                "transaction_id": partition_key,
                "error_code": error_code,
                "error_detail": str(e),
            }
        
        print(json.dumps(log_payload))

        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({"message": "Sorry, something went wrong!", "success": False})
        }