import {App, Stack} from "aws-cdk-lib"
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {Runtime} from "aws-cdk-lib/aws-lambda";
import {HttpLambdaIntegration} from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import {HttpApi, HttpMethod} from "@aws-cdk/aws-apigatewayv2-alpha";

const app = new App()

const myStack = new Stack(app, "MyStack", {
    env: {
        region: process.env.CDK_DEFAULT_REGION,
        account: process.env.CDK_DEFAULT_ACCOUNT,
    }
})

const echo = new NodejsFunction(myStack, "echo", {
    entry: "src/echo-handler.ts",
    bundling: {
        externalModules: [
            "aws-sdk", // Use the 'aws-sdk' available in the Lambda runtime
        ],
    },
    runtime: Runtime.NODEJS_16_X,
    functionName: "MyStack-echo"
})

const echoIntegration = new HttpLambdaIntegration("echoIntegration", echo)

const httpApi = new HttpApi(myStack, "httpApi")

httpApi.addRoutes({
    path: "/echo",
    methods: [HttpMethod.GET],
    integration: echoIntegration
})