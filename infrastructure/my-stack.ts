import {App, Stack} from "aws-cdk-lib"
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {Runtime} from "aws-cdk-lib/aws-lambda";
import {HttpLambdaIntegration} from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import {HttpApi, HttpMethod} from "@aws-cdk/aws-apigatewayv2-alpha";
import {Queue} from "aws-cdk-lib/aws-sqs";
import {Effect, PolicyStatement, Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";

const app = new App()

const myStack = new Stack(app, "MyStack", {
    env: {
        region: process.env.CDK_DEFAULT_REGION,
        account: process.env.CDK_DEFAULT_ACCOUNT,
    }
})

const nameQueue = new Queue(myStack, "nameQueue", {
    queueName: "name-queue"
})

const echoRole = new Role(myStack, "echoRole", {
    assumedBy: new ServicePrincipal("lambda.amazonaws.com")
});
echoRole.addToPolicy(new PolicyStatement({
    actions: ["SQS:*"],
    effect: Effect.ALLOW,
    resources: [nameQueue.queueArn]
}))

const echo = new NodejsFunction(myStack, "echo", {
    entry: "src/echo-handler.ts",
    bundling: {
        externalModules: [
            "aws-sdk", // Use the 'aws-sdk' available in the Lambda runtime
        ],
    },
    runtime: Runtime.NODEJS_16_X,
    functionName: "MyStack-echo",
    role: echoRole
})

const echoIntegration = new HttpLambdaIntegration("echoIntegration", echo)

const httpApi = new HttpApi(myStack, "httpApi")

httpApi.addRoutes({
    path: "/echo",
    methods: [HttpMethod.GET],
    integration: echoIntegration
})

