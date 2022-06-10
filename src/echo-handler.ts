import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from "aws-lambda";

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    console.log("Echo")
    const name = event.queryStringParameters?.["name"] || "unknown"
    return {
        body: `Hi ${name}!`,
        statusCode: 200
    }
}