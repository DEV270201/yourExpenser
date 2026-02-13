import json
import boto3
from botocore.config import Config
config = Config(
    connect_timeout=3,  # Seconds to wait to establish a connection
    read_timeout=9,    # Seconds to wait for a response after sending request
    retries={'max_attempts': 3, 'mode': 'standard'}
)

def lambda_handler(event, context):
     
    dynamodb = boto3.resource('dynamodb', config=config)
    table = dynamodb.Table('Expenser_App')

    user_id = event['pathParameters']['user_id']
    trans_id = event['pathParameters']['trans_id']

    partition_key = f"TRAN:{trans_id}"
    sort_key = f"DATA"

    try:
        resp = table.delete_item(
            Key={
                'PK': partition_key,
                'SK': sort_key
            }
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
                'Content-Type': 'application/json'
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
            'body': json.dumps({"error": "Sorry, something went wrong!", "success": False})
        }