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
#check kubectl version
kubectl --version
#install git
sudo yum install git -y
#Check git version
git version
mkdir jam
https://github.com/iyerb/eks-demo.git
echo "Done"