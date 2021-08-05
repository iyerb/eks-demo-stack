import * as cdk from '@aws-cdk/core';
import * as eks from '@aws-cdk/aws-eks';
import { KeyPair } from 'cdk-ec2-key-pair'
import * as iam from '@aws-cdk/aws-iam'
import * as ec2 from '@aws-cdk/aws-ec2'
import { CfnCapabilities } from '@aws-cdk/core';

const LAB_KEYPAIR_NM = 'lab-key-pair';
export class EksDemoStackStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    new cdk.CfnParameter(this,'KeyName', { 
      type: 'String',
      default: LAB_KEYPAIR_NM })

    // //key pair to be used
    // const key = new KeyPair(this, "lab-key-pair", {
    //   name: 'lab-key-pair',
    //   description: 'Key Pair to be used for JAM EC2 Instance',
    // });
    // key.grantReadOnPublicKey

    const vpc = new ec2.Vpc(this, "JamVpcStack", {
      natGateways: 1,
      subnetConfiguration: [{
        cidrMask: 24,
        name: "JamEC2Instance",
        subnetType: ec2.SubnetType.PUBLIC
      }]
    })
    
    //allows ssh (tcp port 22) access from anywhere 
    const securityGroup = new ec2.SecurityGroup(this, "JamEC2SecurityGroup",{
      vpc, 
      description:"Allow SSH (TCP 22 PORT) in",
      allowAllOutbound: true,
    });
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), "Allow SSH Access");

    const jamec2Role = new iam.Role(this, 'jamec2role',{
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
    });    

    jamec2Role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'));
    jamec2Role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2FullAccess'));
    jamec2Role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'));
    
    
    //use the latest Amazon Linux Image - CPU Type ARM64
    const ami = new ec2.AmazonLinuxImage({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      cpuType: ec2.AmazonLinuxCpuType.X86_64
    })

    const ec2Instance = new ec2.Instance(this, 'JamInstance',{
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.LARGE),
      machineImage: ami,
      securityGroup: securityGroup,
      keyName: 'Ref:'+ LAB_KEYPAIR_NM,
      role: jamec2Role
    });

    // The code that defines your stack goes here
    // const cluster = new eks.Cluster(this, 'ckdekscluster', {
    //   version: eks.KubernetesVersion.V1_18,
    // });
        
    new cdk.CfnOutput(this, 'IP Address', { value: ec2Instance.instancePublicIp });
    new cdk.CfnOutput(this, 'Key Name', { value: LAB_KEYPAIR_NM })
    new cdk.CfnOutput(this, 'Download Key Command', { value: 'aws secretsmanager get-secret-value --secret-id ec2-ssh-key/cdk-keypair/private --query SecretString --output text > cdk-key.pem && chmod 400 cdk-key.pem' })
    new cdk.CfnOutput(this, 'ssh command', { value: 'ssh -i cdk-key.pem -o IdentitiesOnly=yes ec2-user@' + ec2Instance.instancePublicIp })
    
  }

  private createManagedPolicy(role: iam.Role) {
    return new iam.ManagedPolicy(this, 'jam-managed-policy-id', {
      description: "Allows IAM Create Role, Create CloudFormation Stacks",
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            'iam:CreateAccessKey',
            'iam:CreatePolicy',
            'iam:CreateRole',
            'cloudformation:DescribeStacks',
            'cloudformation:DescribeStackEvents',
            'cloudformation:DescribeStackResource',
            'cloudformation:DescribeStackResources',
            'cloudformation:CreateStack',
            'cloudformation:GetTemplate',
            'cloudformation:ValidateTemplate',
            "ec2:List*",
            "ec2:Get*",
            "ec2:*",
            "ec2:Describe*",
            "iam:*",
            "s3:CreateBucket",
            "s3:PutObject",
            "s3:GetBucket",
            "s3:ListBucket",
            "s3:*",
            "logs:Describe*",
            "logs:Get*",
            "ssm:*",
            "elasticloadbalancing:CreateListener",
            "elasticloadbalancing:CreateLoadBalancer",
            "elasticloadbalancing:CreateRule",
            "elasticloadbalancing:CreateTargetGroup",
            "elasticloadbalancing:DeleteListener",
            "elasticloadbalancing:DeleteLoadBalancer",
            "elasticloadbalancing:DeleteRule",
            "elasticloadbalancing:DeleteTargetGroup",
            "elasticloadbalancing:DescribeListeners",
            "elasticloadbalancing:DescribeLoadBalancers",
            "elasticloadbalancing:DescribeRules",
            "elasticloadbalancing:DescribeTargetGroups",
            "cloudformation:*",
            "ecs:*"
          ],
          resources: ['*']
        })
      ],
      roles: [role]
    });
  }
}
