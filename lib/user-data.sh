#!/bin/bash
yum update -y
sudo su
#Connect to your Linux instance as ec2-user using SSH.
#Install node version manager (nvm) by typing the following at the command line.
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh
#Activate nvm by typing the following at the command line.
. ~/.nvm/nvm.sh
#Use nvm to install the latest version of Node.js by typing the following at the command line.
nvm install node
#Test that Node.js is installed and running correctly by typing the following at the command line.
node -e "console.log('Running Node.js ' + process.version)"
#Install aws-cdk
npm install -g aws-cdk
npm install @aws-cdk/aws-eks@1.116.0
#check cdk version
cdk --version
#install kubectl
curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
#install git
sudo yum install git -y
#Check git version
git version
#mkdir jam

mkdir eks-demo
cd eks-demo
cdk init -l typescript
cd lib
vi eks-demo-stack.ts

cdk bootstrap aws://337828849457/ap-southeast-1

# ⏳  Bootstrapping environment aws://337828849457/ap-southeast-1...
#CDKToolkit: creating CloudFormation changeset...
# ✅  Environment aws://337828849457/ap-southeast-1 bootstrapped.

 ✅  EksDemoStack

#Outputs:
#EksDemoStack.ckdeksclusterConfigCommandE04DCF13 = aws eks update-kubeconfig --name ckdekscluster91BD07D9-b77a056c8b304c29894ed2409c09e062 --region ap-southeast-1 --ro
#le-arn arn:aws:iam::337828849457:role/EksDemoStack-ckdeksclusterMastersRoleBE3D5109-4N9G1Z9I7KR4
#EksDemoStack.ckdeksclusterGetTokenCommand5DD9E553 = aws eks get-token --cluster-name ckdekscluster91BD07D9-b77a056c8b304c29894ed2409c09e062 --region ap-southeast-1 --
#role-arn arn:aws:iam::337828849457:role/EksDemoStack-ckdeksclusterMastersRoleBE3D5109-4N9G1Z9I7KR4




echo "<h1>It worked</h1>" > /usr/share/nginx/html/index.html