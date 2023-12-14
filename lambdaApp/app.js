const AWS = require('aws-sdk');

exports.handler = async (event) => {
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    const apiPayload = JSON.parse(event.body);
    const tableName = process.env.TABLE_NAME;

    const params = {
        TableName: tableName,
        Key: { id: apiPayload.id },
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
            body: 'OK'
        };
    } catch (error) {
        console.error('Error updating item:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};
