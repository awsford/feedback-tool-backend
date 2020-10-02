const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    let response = {};
    let statusCode = 400;
    let session = null;
    let error = null;

    const event_id = event.queryStringParameters.id;

    try {
        const db_response = await getItem(process.env.SESSION_TABLE_NAME, event_id);

        statusCode = 200;
        session = db_response.Item;

        console.log("Fetched Session from DB: ");
        console.log(JSON.stringify(session));
    }
    catch (e) {
        console.log("Unable to fetch session from DB: ");
        console.log(e);
        error = e;
    }

    response = {
        'statusCode': statusCode,
        'body': JSON.stringify({ session, error })
    };
}

const getItem = (table, key) => {
    const params = {
        TableName: table,
        Key: { event_id: key }
    };
    return db.get(params).promise();
};