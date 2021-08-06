import * as ec2 from '@aws-cdk/aws-ec2'
import * as iam from '@aws-cdk/aws-iam'
import * as cdk from '@aws-cdk/core'
import * as eks from '@aws-cdk/aws-eks';
import {readFileSync} from 'fs';
import { CfnRefElement } from '@aws-cdk/core';
import { KeyPair } from 'cdk-ec2-key-pair';

const LAB_KEYPAIR_NM = 'lab-key-pair';
export class JamStack extends cdk.Stack {
    
    constructor(scope: cdk.Construct, id:string, props?: cdk.StackProps ){
        super(scope,id,props)

        const keyname = new cdk.CfnParameter(this,'KeyName', { 
            type: 'String',
            default: LAB_KEYPAIR_NM })

        //create vpc
        const vpc = new ec2.Vpc(this, 'jam-cdk-vpc',{
            cidr: '10.0.0.0/16',
            natGateways: 1,
            subnetConfiguration:[{
                name: 'public', cidrMask: 24, subnetType: ec2.SubnetType.PUBLIC
            }],
        })

        const securityGroup = new ec2.SecurityGroup(this, 'jam-sg', {
            vpc,
            allowAllOutbound: true,
        })

        securityGroup.addIngressRule(
            ec2.Peer.anyIpv4(),
            ec2.Port.tcp(22),
            'Allow ssh from anywhere',
        )

        securityGroup.addIngressRule(
            ec2.Peer.anyIpv4(),
            ec2.Port.tcp(80),
            'allow HTTP traffic from anywhere',
        );
      
        securityGroup.addIngressRule(
            ec2.Peer.anyIpv4(),
            ec2.Port.tcp(443),
            'allow HTTPS traffic from anywhere',
        );
        // 👇 create a Role for the EC2 Instance
        const role = new iam.Role(this, 'webserver-role', {
            assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
            managedPolicies: [
            iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'),
            ],
        });

        // 👇 create the EC2 Instance
        const ec2Instance = new ec2.Instance(this, 'ec2-instance', {
            vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PUBLIC,
            },
            role: role,
            securityGroup: securityGroup,
            instanceType: ec2.InstanceType.of(
                ec2.InstanceClass.T2,
                ec2.InstanceSize.MICRO,
            ),
            machineImage: new ec2.AmazonLinuxImage({
                generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
            }),
            keyName: 
                "Ref: KeyName"
        });       
         // 👇 load contents of script
        const userDataScript = readFileSync('./lib/user-data.sh', 'utf8');
        // 👇 add the User Data script to the Instance
        ec2Instance.addUserData(userDataScript);
        new cdk.CfnOutput(this, 'Key Name', { value: LAB_KEYPAIR_NM })
        new cdk.CfnOutput(this, 'IP Address', { value: ec2Instance.instancePublicIp });    
        new cdk.CfnOutput(this, 'Download Key Command', { value: 'aws secretsmanager get-secret-value --secret-id ec2-ssh-key/cdk-keypair/private --query SecretString --output text > cdk-key.pem && chmod 400 cdk-key.pem' })
        new cdk.CfnOutput(this, 'ssh command', { value: 'ssh -i cdk-key.pem -o IdentitiesOnly=yes ec2-user@' + ec2Instance.instancePublicIp })
        
    }
}