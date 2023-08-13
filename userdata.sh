#!/bin/bash

# install git
sudo yum update -y
sudo yum install git -y

# install nvm, node, and yarn
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.36.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 16
nvm use 16
node -e "console.log('Running Node.js ' + process.version)"
npm install --global yarn

# clone repo and start yarn
cd /home/ec2-user
git clone https://github.com/wesleychipeco/trifecta-website-v3.git
cd trifecta-website-v3/
yarn
cd proxy-server/
yarn
cd ..
yarn dev