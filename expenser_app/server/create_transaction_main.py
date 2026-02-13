# serverless lambda function 

import json
import boto3
import uuid
import math
from decimal import Decimal
from botocore.config import Config
config = Config(
    connect_timeout=3,  # Seconds to wait to establish a connection
    read_timeout=9, 
    retries = {
        'max_attempts': 3,
        'mode': 'standard'
    }
)

def lambda_handler(event, context):

    dynamodb = boto3.resource('dynamodb', config=config)
    table = dynamodb.Table('Expenser_App')

    print("event in create transaction: ", event)
    
    #getting all the attributes
    user_id = event['pathParameters']['user_id']
    body = json.loads(event['body'])
    Category = body['category']
    Desc = body['desc']
    Value = Decimal(str(body['value']))
    Type = body['type']
    Currency = body['currency']
    Date = body['date']

    #now forming additional attributes required for the dynamodb table
    unique_id = str(uuid.uuid4())
    partition_key = f"TRANS:{unique_id}"
    sort_key = f"DATA"
    GSI1_PK = f"USER:{user_id}"
    GSI1_SK = f"{Type.upper()[:3]}:{Date}"
    GSI2_PK = f"USER:{user_id}"

    # calculating the bucket value 
    bucket_val = (math.ceil(body['value'] * 1e-2) * 100)-1
    GSI2_SK = f"{bucket_val}:{Date}"
    GSI3_PK = f"USER:{user_id}"
    GSI3_SK = f"{Category.upper()[:4]}:{Date}"

    try:
        resp = dynamodb.meta.client.transact_write_items(
            TransactItems=[
                {
                    "Put": {
                        "TableName": "Expenser_App",
                          "Item" : {
                            "PK" : partition_key,
                            "SK" : sort_key,
                            "GSI1_PK" : GSI1_PK,
                            "GSI1_SK" : GSI1_SK,
                            "GSI2_PK" : GSI2_PK,
                            "GSI2_SK" : GSI2_SK,
                            "GSI3_PK" : GSI3_PK,
                            "GSI3_SK" : GSI3_SK,
                            "Category" : Category,
                            "Desc" : Desc,
                            "Value" : Decimal(str(Value)),
                            "Type" : Type,
                            "Currency" : Currency,
                            "Date" : Date
                        }
                    }
                },
                {
                    "Update": {
                        "TableName": "Expenser_App",
                        "Key": {
                            "PK": GSI1_PK,
                            "SK": f"SUMMARY:{Date[:7]}"
                        },
                        'UpdateExpression': f"SET {Type} = if_not_exists({Type}, :zero) + :val, #c = if_not_exists(#c, :zero) + :val",
                        'ExpressionAttributeNames': {
                            '#c': f"{Type[:3] + ':' + Category}" # Handles dynamic category names safely
                        },
                        'ExpressionAttributeValues': {
                            ':zero': Decimal('0'),
                            ':val': Value
                        }
                    }
                },
            ]
        )

        log_payload = {
                "level": "SUCCESS",
                "message": "Transaction added successfully",
                "user_id": GSI1_PK,
                "context": f"{Date}"
            }
        
        print(json.dumps(log_payload))

        lll

        return {
            "statusCode" : 200,
             "headers": {
                "Content-Type": "application/json",
            },
            "body" : json.dumps({
                "message" : "Transaction created successfully",
                "success" : True
            })
        }
    
    except Exception as e:
        error_code = e.response.get('Error', {}).get('Code') if hasattr(e, 'response') else "UnknownError"
        log_payload = {
                "level": "CRITICAL",
                "message": "Transaction failed after all retries",
                "user_id": GSI1_PK,
                "transaction_id": partition_key,
                "error_code": error_code,
                "error_detail": str(e),
                "context": f"{json.dumps({
                            "Category" : Category,
                            "Value" : str(Value),
                            "Type" : Type,
                            "Currency" : Currency,
                            "Date" : Date
                        })}"
            }
            
        print(json.dumps(log_payload))

        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
            },
            "body": json.dumps({
                "message": "Sorry, something went wrong!",
                "success": False
            })
        }
