const AWS = require('aws-sdk');

exports.handler = async (event) => {
    
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    const tableName = process.env.TABLE_NAME;
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
            return {
                statusCode: 200,
                //body: JSON.stringify(data.Item)
                body: 'OK'
            };
        }
        else {
            return {
                statusCode: 404,
                body: 'Not Found'
            };
        }
    } 
    catch (error) {
        console.error('Error querying DynamoDB:', error);

        return {
            statusCode: 500,
            body: 'Internal Server Error'
        };
    }
};
