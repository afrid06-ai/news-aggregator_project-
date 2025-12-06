#!/bin/bash

echo "Deploying News Aggregator Backend to EC2..."

# Navigate to app directory
cd ~/news-aggregator/news-aggregator_project-/Afrid_shaik_node

# Pull latest code
git pull origin main

# Install dependencies
npm install --production

# Restart application with PM2
pm2 restart news-aggregator || pm2 start server.js --name news-aggregator

# Save PM2 process list
pm2 save

echo "Deployment complete!"
echo "Check status: pm2 status"
echo "View logs: pm2 logs news-aggregator"

