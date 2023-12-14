const AWS = require('aws-sdk');

exports.handler = async (event) => {
    
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    const tableName = process.env.TABLE_NAME;
    var userId = event.queryStringParameters.id;

    const params = {
        TableName: tableName,
        Key: {
            // Define your key here
            // For example, if your partition key is 'id'
            id: userId
        }
    };


    try {
        const data = await dynamoDB.get(params).promise();

        return {
            statusCode: 200,
            //body: JSON.stringify(data.Item)
            body: 'OK'
        };
    } catch (error) {
        console.error('Error querying DynamoDB:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};
