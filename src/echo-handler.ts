import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from "aws-lambda";
import {SQS} from "aws-sdk";

const sqs = new SQS()

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    console.log("Echo")
    const name = event.queryStringParameters?.["name"] || "unknown"
    const queueUrl = await sqs.getQueueUrl({
        QueueName: "name-queue"
    }).promise()

    if (!queueUrl.QueueUrl) {
        return {
            body: `Unable to find queue`,
            statusCode: 500
        }
    }

    await sqs.sendMessage({
        MessageBody: `Hi ${name}!`,
        QueueUrl: queueUrl.QueueUrl,
    }).promise()

    return {
        body: `Hi ${name}!`,
        statusCode: 200
    }
}