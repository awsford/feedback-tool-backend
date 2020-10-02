const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    console.log("Received event: ");
    console.log(JSON.stringify(event));

    let response = {};
    let statusCode = 400;
    let session = null;
    let error = null;

    const session = event.body.session.replace(/ /g, "-");

    const item = {
        event_id: event.body.event_id,
        user_id: event.body.user_id + "_" + session,
        score: event.body.score,
        createdAt: Math.round(new Date().getTime() / 1000)
    }

    try {
        await putItem(process.env.SCORES_TABLE_NAME, event_id);

        statusCode = 200;
        session = "Successfully added to scores DB";
        console.log("Added score to DB");
    }
    catch (e) {
        console.log("Unable to add score to DB: ");
        console.log(e);
        error = e;
    }

    response = {
        'statusCode': statusCode,
        'body': JSON.stringify({ session, error })
    };
    return response;
}

const putItem = (table, item) => {
    const params = {
        TableName: table,
        Item: item
    };
    return db.put(params).promise();
};