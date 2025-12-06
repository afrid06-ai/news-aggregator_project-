#!/bin/bash

echo "Setting up EC2 instance for News Aggregator Backend..."

# Update system
sudo yum update -y

# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Git
sudo yum install -y git

# Verify installations
echo "Node.js version:"
node --version
echo "npm version:"
npm --version
echo "PM2 version:"
pm2 --version

# Create app directory
mkdir -p ~/news-aggregator
cd ~/news-aggregator

echo "Setup complete! Next steps:"
echo "1. Clone your repository: git clone https://github.com/afrid06-ai/news-aggregator_project-.git"
echo "2. cd news-aggregator_project-/Afrid_shaik_node"
echo "3. npm install"
echo "4. Set environment variables"
echo "5. Start with PM2: pm2 start server.js --name news-aggregator"
echo "6. Save PM2: pm2 save"
echo "7. Setup PM2 startup: pm2 startup"

