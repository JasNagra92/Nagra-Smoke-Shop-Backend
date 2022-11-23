import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkEbInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const webAppZipArchive = new cdk.aws_s3_assets.Asset(this, "WebAppZip", {
      path: `${__dirname}/../app.zip`,
    });

    const appName = "MyWebApp";
    const app = new cdk.aws_elasticbeanstalk.CfnApplication(
      this,
      "Application",
      {
        applicationName: appName,
      }
    );

    const appVersionProps = new cdk.aws_elasticbeanstalk.CfnApplicationVersion(
      this,
      "AppVersion",
      {
        applicationName: appName,
        sourceBundle: {
          s3Bucket: webAppZipArchive.s3BucketName,
          s3Key: webAppZipArchive.s3ObjectKey,
        },
      }
    );

    appVersionProps.addDependsOn(app);

    const myRole = new cdk.aws_iam.Role(
      this,
      `${appName}-aws-elasticbeanstalk-ec2-role`,
      {
        assumedBy: new cdk.aws_iam.ServicePrincipal("ec2.amazonaws.com"),
      }
    );

    const managedPolicy = cdk.aws_iam.ManagedPolicy.fromAwsManagedPolicyName(
      "AWSElasticBeanstalkWebTier"
    );
    myRole.addManagedPolicy(managedPolicy);

    const myProfileName = `${appName}-InstanceProfile`;

    const instanceProfile = new cdk.aws_iam.CfnInstanceProfile(
      this,
      myProfileName,
      {
        instanceProfileName: myProfileName,
        roles: [myRole.roleName],
      }
    );

    const optionSettingProperties: cdk.aws_elasticbeanstalk.CfnEnvironment.OptionSettingProperty[] =
      [
        {
          namespace: "aws:autoscaling:launchconfiguration",
          optionName: "IamInstanceProfile",
          value: myProfileName,
        },
        {
          namespace: "aws:autoscaling:asg",
          optionName: "MinSize",
          value: "1",
        },
        {
          namespace: "aws:autoscaling:asg",
          optionName: "MaxSize",
          value: "1",
        },
        {
          namespace: "aws:ec2:instances",
          optionName: "InstanceTypes",
          value: "t2.micro",
        },
      ];

    const elbEnv = new cdk.aws_elasticbeanstalk.CfnEnvironment(
      this,
      "Environment",
      {
        environmentName: "MyWebAppEnvironment",
        applicationName: app.applicationName || appName,
        solutionStackName: "64bit Amazon Linux 2 v5.6.1 running Node.js 16",
        optionSettings: optionSettingProperties,
        versionLabel: appVersionProps.ref,
      }
    );
  }
}
