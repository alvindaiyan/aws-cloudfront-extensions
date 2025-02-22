import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as cr from 'aws-cdk-lib/custom-resources';
import { CustomResource } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';


export class CountryRedirectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.templateOptions.description = "(SO8145) - Redirects to a country-specific version of a site based on the country of the user";

    const cfDistId = new cdk.CfnParameter(this, 'cfDistId', {
      description: 'CloudFront distribution id on which the function is deployed',
      type: 'String',
    });

    const behavior = new cdk.CfnParameter(this, 'behavior', {
      description: 'CloudFront behaviors on which the function is deployed',
      type: 'String',
    });

    const stage = new cdk.CfnParameter(this, 'stage', {
      description: 'CloudFront stage on which the function is deployed',
      type: 'String',
    });

    const lambdaRole = new iam.Role(this, 'CountryRedirectLambdaRole', {
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal("lambda.amazonaws.com"),
      ),
    });

    const lambdaPolicy = new iam.Policy(this, 'CountryRedirectLambdaPolicy', {
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          resources: [
            `arn:aws:lambda:*:${cdk.Aws.ACCOUNT_ID}:function:*`,
            `arn:aws:lambda:*:${cdk.Aws.ACCOUNT_ID}:function:*:*`
          ],
          actions: [
            "lambda:*"
          ],
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          resources: [
            `arn:aws:logs:*:${cdk.Aws.ACCOUNT_ID}:log-group:*`,
            `arn:aws:logs:*:${cdk.Aws.ACCOUNT_ID}:log-group:*:log-stream:*`
          ],
          actions: [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents"
          ],
        }),
      ]
    });

    const cloudfrontPolicy = new iam.Policy(this, 'CountryRedirectCFPolicy', {
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          resources: ['*'],
          actions: [
            "cloudfront:Get*",
            "cloudfront:CreateOriginRequestPolicy",
            "cloudfront:UpdateDistribution",
            "cloudfront:DeleteOriginRequestPolicy",
            "cloudfront:UpdateOriginRequestPolicy",
            "cloudfront:DescribeFunction",
            "cloudfront:ListTagsForResource",
            "cloudfront:CreateFunction",
            "cloudfront:UpdateFunction",
            "cloudfront:DeleteFunction",
          ]
        })
      ]
    });

    lambdaRole.attachInlinePolicy(lambdaPolicy);
    lambdaRole.attachInlinePolicy(cloudfrontPolicy);

    // Add a cloudfront Function and deploy it to the live stage
    const cfFunction = new cloudfront.Function(this, 'RedirectByCountry', {
      code: cloudfront.FunctionCode.fromFile({
        filePath: path.join(__dirname, './redirect-by-country-function.js'),
      }),
    });

    // Custom resource to deploy CFF
    const crLambda = new lambda.Function(this, "CFFDeployer", {
      description: "This lambda function deploy CFF onto CloudFront distribution",
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lib/lambda/custom_resource')),
      handler: "custom_resource.lambda_handler",
      role: lambdaRole,
      memorySize: 256,
      timeout: cdk.Duration.minutes(15),
      environment: {
        CFF_ARN: cfFunction.functionArn,
        CF_DIST_ID: cfDistId.valueAsString,
        CF_BEHAVIOR: behavior.valueAsString,
        CF_STAGE: stage.valueAsString,
      }
    });

    crLambda.node.addDependency(cfFunction)

    const redirectProvider = new cr.Provider(this, 'RedirectProvider', {
      onEventHandler: crLambda,
      logRetention: logs.RetentionDays.ONE_DAY,
    });

    new CustomResource(this, 'RedirectCustomResource', {
      serviceToken: redirectProvider.serviceToken,
      resourceType: "Custom::RedirectByCountry",
    });
    
    // Output
    new cdk.CfnOutput(this, "FunctionARN", {
      value: cfFunction.functionArn,
      description: "the function arn value"
    });

    new cdk.CfnOutput(this, "AddCloudFrontViewerCountryHeader", {
      value: "You need to add cloudfront-viewer-country in the origin request policy. The solution will add the header automatically if your CloudFront distribution doesn't have an origin request policy"
    });

  }

}
