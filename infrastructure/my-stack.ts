import {App, Stack} from "@aws-cdk/core"

const app = new App()

const myStack = new Stack(app, "MyStack", {
    env: {
        region: process.env.CDK_DEFAULT_REGION,
        account: process.env.CDK_DEFAULT_ACCOUNT,
    }
})