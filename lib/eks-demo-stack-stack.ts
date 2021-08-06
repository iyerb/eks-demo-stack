import * as cdk from '@aws-cdk/core';
import * as eks from '@aws-cdk/aws-eks';

export class EksDemoStackStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    /**
     * Code to create the EKS Cluster
     */
     const cluster = new eks.Cluster(this, 'ckdekscluster', {
      version: eks.KubernetesVersion.V1_18,
    });
    
  }
}
