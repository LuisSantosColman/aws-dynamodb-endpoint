/* Example of expected payload for the POST request: { "id": "Miro-User-ID" } */

const AWS = require('aws-sdk');

exports.handler = async (event) => {
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    const tableName = process.env.TABLE_NAME;
    const apiPayload = JSON.parse(event.body);
    const onlyLettersAndNumbers = function(str) {
    	return /^[A-Za-z0-9]*$/.test(str);
    }
    
    if (apiPayload.hasOwnProperty('id')) {
        const userId = apiPayload.id.toString();
        const isValidUserId = onlyLettersAndNumbers(userId);
        if (!isValidUserId || !userId) {
            /* Returning a 500 error if the value of the "id" parameter posted contains characters other than a string with only letters and numbers */
            return {
                statusCode: 500,
                headers: {
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Origin": "*", // Allow from anywhere 
                    "Access-Control-Allow-Methods": "POST" // Allow only POST request 
                },
                body: 'Internal Server Error'
            };
        }
        
        const params = {
            TableName: tableName,
            Key: { id: userId },
            UpdateExpression: 'set hasAcceptedTerms = :hasAcceptedTerms',
            ExpressionAttributeValues: {
                ':hasAcceptedTerms': 'yes'
            },
            ReturnValues: 'UPDATED_NEW'
        };
    
        try {
            const result = await dynamoDB.update(params).promise();
            return {
                statusCode: 200,
                //body: JSON.stringify(result.Attributes)
                headers: {
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Origin": "*", // Allow from anywhere 
                    "Access-Control-Allow-Methods": "POST" // Allow only POST request 
                },
                body: 'OK'
            };
        } catch (error) {
            console.error('Error updating item:', error);
            
            /* Returning a 500 error for any other error not catched above */
            return {
                statusCode: 500,
                headers: {
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Origin": "*", // Allow from anywhere 
                    "Access-Control-Allow-Methods": "POST" // Allow only POST request 
                },
                body: JSON.stringify({ error: 'Internal Server Error' })
            };
        }
    }
    else {
        /* Returning a 500 error if the "id" parameter was not passed in the posted payload */
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*", // Allow from anywhere 
                "Access-Control-Allow-Methods": "POST" // Allow only POST request 
            },
            body: 'Internal Server Error'
        };
    }
};
