#!/bin/bash
yum update -y
sudo su
#Connect to your Linux instance as ec2-user using SSH.
#Install node version manager (nvm) by typing the following at the command line.
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
#Activate nvm by typing the following at the command line.
. ~/.nvm/nvm.sh
#Use nvm to install the latest version of Node.js by typing the following at the command line.
nvm install
#Test that Node.js is installed and running correctly by typing the following at the command line.
node -e "console.log('Running Node.js ' + process.version)"
#Install aws-cdk
npm install -g aws-cdk
npm install @aws-cdk/aws-eks@1.116.0
#check cdk version
cdk --version
#install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
chmod +x kubectl
mkdir -p ~/.local/bin/kubectl
mv ./kubectl ~/.local/bin/kubectl
#check kubectl version
kubectl version
#install git
sudo yum install git -y
#Check git version
git version
mkdir jam
cd jam
git clone https://github.com/iyerb/eks-demo.git
cd eks-demo
echo "Done"