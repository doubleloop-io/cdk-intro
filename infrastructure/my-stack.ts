import {App, Stack} from "aws-cdk-lib"
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {Runtime} from "aws-cdk-lib/aws-lambda";

const app = new App()

const myStack = new Stack(app, "MyStack", {
    env: {
        region: process.env.CDK_DEFAULT_REGION,
        account: process.env.CDK_DEFAULT_ACCOUNT,
    }
})

const lambda = new NodejsFunction(myStack, "echo", {
    entry: "src/echo-handler.ts",
    bundling: {
        externalModules: [
            "aws-sdk", // Use the 'aws-sdk' available in the Lambda runtime
        ],
    },
    runtime: Runtime.NODEJS_16_X,
    functionName: "MyStack-echo"
})