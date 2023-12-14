const AWS = require('aws-sdk');

exports.handler = async (event) => {
    
    const onlyLettersAndNumbers = function(str) {
    	return /^[A-Za-z0-9]*$/.test(str);
    }
    
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    const tableName = process.env.TABLE_NAME;
    
    if (event && event.hasOwnProperty('queryStringParameters') && !event.queryStringParameters) {
        
        /* Returning a 500 error if the URL parameter "u" is not passed in the GET request */
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*", // Allow from anywhere 
                "Access-Control-Allow-Methods": "GET" // Allow only GET request 
            },
            body: 'Internal Server Error'
        };
    }
    
    if (event && event.hasOwnProperty('queryStringParameters') && event.queryStringParameters.hasOwnProperty('u') && event.queryStringParameters.u !== '') {
        
        const userId = event.queryStringParameters.u.toString();
        const isValidUserId = onlyLettersAndNumbers(userId);
        
        if (!isValidUserId) {
            
            /* Returning a 500 error if the value of the URL parameter "u" passed in the GET request contains characters other than letters and numbers */
            return {
                statusCode: 500,
                headers: {
                    "Access-Control-Allow-Headers" : "Content-Type",
                    "Access-Control-Allow-Origin": "*", // Allow from anywhere 
                    "Access-Control-Allow-Methods": "GET" // Allow only GET request 
                },
                body: 'Internal Server Error'
            };
        }
    }
    else {
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*", // Allow from anywhere 
                "Access-Control-Allow-Methods": "GET" // Allow only GET request 
            },
            body: 'Internal Server Error'
        };
    }
    
    const userId = event.queryStringParameters.u.toString();

    const params = {
        TableName: tableName,
        Key: {
            id: userId
        }
    };

    try {
        const data = await dynamoDB.get(params).promise();
        
        if (data && data.hasOwnProperty('Item') && data.Item.hasOwnProperty('id') && data.Item.id.toString() === userId) {
            
            /* Returning a 200 OK if the value of the URL parameter "u" matches an entry in the MiroBannerTermsAccepters DynamoDB table */
            return {
                statusCode: 200,
                //body: JSON.stringify(data.Item)
                headers: {
                    "Access-Control-Allow-Headers" : "Content-Type",
                    "Access-Control-Allow-Origin": "*", // Allow from anywhere 
                    "Access-Control-Allow-Methods": "GET" // Allow only GET request 
                },
                body: 'OK'
            };
        }
        else {
            
            /* Returning a 404 error if the value of the URL parameter "u" does not match any entry in the DynamoDB table */
            return {
                statusCode: 404,
                headers: {
                    "Access-Control-Allow-Headers" : "Content-Type",
                    "Access-Control-Allow-Origin": "*", // Allow from anywhere 
                    "Access-Control-Allow-Methods": "GET" // Allow only GET request 
                },
                body: 'Not Found'
            };
        }
    } 
    catch (error) {
        console.error('Error querying DynamoDB:', error);
        
        /* Returning a 500 error for any other error not catched above */
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*", // Allow from anywhere 
                "Access-Control-Allow-Methods": "GET" // Allow only GET request 
            },
            body: 'Internal Server Error'
        };
    }
};
