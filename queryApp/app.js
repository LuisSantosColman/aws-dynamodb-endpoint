const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const tableName = process.env.DYNAMODB_TABLE;
    const userID = event.queryStringParameters.id;

    const params = {
        TableName: tableName,
        Key: {
            // Define your key here
            // For example, if your partition key is 'id'
            id: userID
        },
    };

    try {
        const data = await dynamoDB.get(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify(data.Item),
        };
    } catch (error) {
        console.error('Error querying DynamoDB:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: error })
        };
    }
};
