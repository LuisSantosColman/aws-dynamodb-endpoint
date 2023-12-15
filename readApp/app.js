const AWS = require('aws-sdk');

exports.handler = async (event) => {
    
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    const tableName = process.env.TABLE_NAME;
    
    const onlyLettersAndNumbers = function(str) {
    	return /^[A-Za-z0-9]*$/.test(str);
    };
    
    const responseHeaders = {
        "Access-Control-Allow-Headers" : "Accept",
        "Access-Control-Allow-Origin": "*", // Allow from anywhere 
        "Access-Control-Allow-Methods": "GET", // Allow only GET request
        "Content-Type": "text/plain"
    };
    
    if (event && event.hasOwnProperty('queryStringParameters') && !event.queryStringParameters) {
        
        /* Returning a 400 error if the URL parameter "u" is not passed in the GET request */
        return {
            statusCode: 400,
            headers: responseHeaders,
            body: 'Bad Request'
        };
    }
    
    if (event && event.hasOwnProperty('queryStringParameters') && event.queryStringParameters.hasOwnProperty('u') && event.queryStringParameters.u !== '') {
        
        const userId = event.queryStringParameters.u.toString();
        const isValidUserId = onlyLettersAndNumbers(userId);
        
        if (!isValidUserId) {
            
            /* Returning a 409 error if the value of the URL parameter "u" passed in the GET request contains characters other than letters and numbers */
            return {
                statusCode: 409,
                headers: responseHeaders,
                body: 'Invalid Data'
            };
        }
    }
    else {
        return {
            statusCode: 415,
            headers: responseHeaders,
            body: 'Invalid Request'
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
                headers: responseHeaders,
                body: 'OK'
            };
        }
        else {
            
            /* Returning a 404 error if the value of the URL parameter "u" does not match any entry in the DynamoDB table */
            return {
                statusCode: 404,
                headers: responseHeaders,
                body: 'Not Found'
            };
        }
    } 
    catch (error) {
        console.error('Error querying DynamoDB:', error);
        
        /* Returning a 500 error for any other error not catched above */
        return {
            statusCode: 500,
            headers: responseHeaders,
            body: 'Internal Server Error'
        };
    }
};
