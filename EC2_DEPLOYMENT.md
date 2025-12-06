# AWS EC2 Deployment Guide

Complete step-by-step guide to deploy your News Aggregator backend to AWS EC2.

## Prerequisites

- AWS account (sign up at https://aws.amazon.com - free tier available)
- Basic knowledge of Linux commands
- SSH client (Terminal on Mac/Linux, PuTTY on Windows)
- GitHub repository with code pushed

## Step 1: Launch EC2 Instance

### 1.1 Access EC2 Console

1. Go to https://console.aws.amazon.com
2. Sign in to your AWS account
3. Search for "EC2" in the services search bar
4. Click on "EC2" to open the EC2 Dashboard

### 1.2 Launch Instance

1. Click the **"Launch Instance"** button (orange button, top right)
2. You'll see a multi-step form

### 1.3 Name Your Instance

- **Name**: `news-aggregator-backend`
- (Optional) Add tags if needed

### 1.4 Choose AMI (Amazon Machine Image)

Select one of these (both are free tier eligible):

**Option A: Amazon Linux 2023** (Recommended)
- Click on "Amazon Linux 2023 AMI"
- Free tier eligible
- Good for beginners

**Option B: Ubuntu Server 22.04 LTS**
- Search for "Ubuntu" in AMI search
- Select "Ubuntu Server 22.04 LTS"
- Also free tier eligible

### 1.5 Choose Instance Type

- Select: **t2.micro** (Free tier eligible)
  - 1 vCPU, 1 GB RAM
  - 750 hours/month free for 12 months
- For better performance: **t3.micro** or **t3.small** (~$8-15/month)

### 1.6 Create Key Pair

1. Under "Key pair (login)", click **"Create new key pair"**
2. **Key pair name**: `news-aggregator-key`
3. **Key pair type**: `RSA`
4. **Private key file format**: 
   - `.pem` for Mac/Linux
   - `.ppk` for Windows (PuTTY)
5. Click **"Create key pair"**
6. **IMPORTANT**: The `.pem` file will download automatically
   - Save it in a secure location (e.g., `~/Downloads/`)
   - You'll need this to connect to your server
   - **Don't lose it!** You can't download it again.

### 1.7 Network Settings

1. **VPC**: Leave default
2. **Subnet**: Leave default
3. **Auto-assign Public IP**: Enable
4. **Security Group**: Create new security group
   - **Security group name**: `news-aggregator-sg`
   - **Description**: `Security group for news aggregator backend`

5. **Add Inbound Rules** (click "Add security group rule" for each):

   **Rule 1 - SSH:**
   - **Type**: SSH
   - **Protocol**: TCP
   - **Port**: 22
   - **Source**: My IP (for security) OR Anywhere (0.0.0.0/0) for testing

   **Rule 2 - HTTP:**
   - **Type**: HTTP
   - **Protocol**: TCP
   - **Port**: 80
   - **Source**: Anywhere (0.0.0.0/0)

   **Rule 3 - HTTPS:**
   - **Type**: HTTPS
   - **Protocol**: TCP
   - **Port**: 443
   - **Source**: Anywhere (0.0.0.0/0)

   **Rule 4 - Custom TCP (Your App):**
   - **Type**: Custom TCP
   - **Protocol**: TCP
   - **Port**: 3000
   - **Source**: Anywhere (0.0.0.0/0)

### 1.8 Configure Storage

- **Size**: 8 GB (free tier) or 20 GB (recommended)
- **Volume type**: gp3 (default)
- Leave other settings as default

### 1.9 Advanced Details (Optional)

- Leave as default for now
- Can configure later if needed

### 1.10 Launch Instance

1. Review all settings
2. Click **"Launch Instance"** (orange button, bottom right)
3. You'll see a success message
4. Click **"View all instances"**
5. Wait for instance status to be **"Running"** (green checkmark)
   - Takes 1-2 minutes

## Step 2: Connect to EC2 Instance

### 2.1 Get Connection Details

1. In EC2 Dashboard, select your instance
2. Copy the **"Public IPv4 address"** (e.g., `54.123.45.67`)
3. Note your **key pair name** (e.g., `news-aggregator-key.pem`)

### 2.2 Connect via SSH (Mac/Linux)

**First time - Make key executable:**
```bash
chmod 400 ~/Downloads/news-aggregator-key.pem
```

**Connect:**
```bash
ssh -i ~/Downloads/news-aggregator-key.pem ec2-user@YOUR_PUBLIC_IP
```

**For Ubuntu instances**, use `ubuntu` instead of `ec2-user`:
```bash
ssh -i ~/Downloads/news-aggregator-key.pem ubuntu@YOUR_PUBLIC_IP
```

**Example:**
```bash
ssh -i ~/Downloads/news-aggregator-key.pem ec2-user@54.123.45.67
```

### 2.3 Connect via SSH (Windows)

**Option A: Using Windows Terminal/PowerShell**
```powershell
ssh -i C:\path\to\news-aggregator-key.pem ec2-user@YOUR_PUBLIC_IP
```

**Option B: Using PuTTY**
1. Download PuTTY: https://www.putty.org/
2. Convert `.pem` to `.ppk` using PuTTYgen
3. Use PuTTY to connect with the `.ppk` file

### 2.4 Verify Connection

Once connected, you should see:
```
[ec2-user@ip-xxx-xxx-xxx-xxx ~]$
```

You're now in your EC2 instance! 🎉

## Step 3: Setup Server Environment

### 3.1 Update System

**For Amazon Linux:**
```bash
sudo yum update -y
```

**For Ubuntu:**
```bash
sudo apt update && sudo apt upgrade -y
```

### 3.2 Install Node.js 18

**For Amazon Linux:**
```bash
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

**For Ubuntu:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verify installation:**
```bash
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x or 10.x.x
```

### 3.3 Install PM2 (Process Manager)

PM2 keeps your app running even after you disconnect:

```bash
sudo npm install -g pm2
```

**Verify:**
```bash
pm2 --version
```

### 3.4 Install Git

**For Amazon Linux:**
```bash
sudo yum install -y git
```

**For Ubuntu:**
```bash
sudo apt install -y git
```

**Verify:**
```bash
git --version
```

## Step 4: Clone and Setup Your Application

### 4.1 Clone Repository

```bash
cd ~
git clone https://github.com/afrid06-ai/news-aggregator_project-.git
cd news-aggregator_project-/Afrid_shaik_node
```

### 4.2 Install Dependencies

```bash
npm install --production
```

This installs all packages listed in `package.json`.

### 4.3 Set Environment Variables

**Option A: Create .env file (Recommended)**

```bash
nano .env
```

Paste this:
```
MONGODB_URI=mongodb+srv://ashai49_db_user:i0lqsmLgazKi705n@cluster0.lopjrc9.mongodb.net/projectdb?retryWrites=true&w=majority
NEWS_API_KEY=70b2c376186d499f8a0cd40c5cd474d3
PORT=3000
NODE_ENV=production
```

Save: Press `Ctrl+X`, then `Y`, then `Enter`

**Note:** You'll need to install `dotenv` package to use .env file:
```bash
npm install dotenv
```

Then add to top of `server.js`:
```javascript
require('dotenv').config();
```

**Option B: Export Environment Variables**

```bash
export MONGODB_URI="mongodb+srv://ashai49_db_user:i0lqsmLgazKi705n@cluster0.lopjrc9.mongodb.net/projectdb?retryWrites=true&w=majority"
export NEWS_API_KEY="70b2c376186d499f8a0cd40c5cd474d3"
export PORT=3000
export NODE_ENV=production
```

**Option C: Set in PM2 ecosystem file (Best for production)**

Create `ecosystem.config.js`:
```bash
nano ecosystem.config.js
```

Paste:
```javascript
module.exports = {
  apps: [{
    name: 'news-aggregator',
    script: 'server.js',
    env: {
      MONGODB_URI: 'mongodb+srv://ashai49_db_user:i0lqsmLgazKi705n@cluster0.lopjrc9.mongodb.net/projectdb?retryWrites=true&w=majority',
      NEWS_API_KEY: '70b2c376186d499f8a0cd40c5cd474d3',
      PORT: 3000,
      NODE_ENV: 'production'
    }
  }]
};
```

## Step 5: Start Application with PM2

### 5.1 Start the App

**If using ecosystem file:**
```bash
pm2 start ecosystem.config.js
```

**If using environment variables:**
```bash
pm2 start server.js --name news-aggregator
```

### 5.2 Check Status

```bash
pm2 status
```

You should see your app running with status "online".

### 5.3 View Logs

```bash
pm2 logs news-aggregator
```

Look for:
- "Server running on port 3000"
- "MongoDB connected successfully"

### 5.4 Save PM2 Configuration

```bash
pm2 save
```

This saves the current process list so PM2 remembers your app.

### 5.5 Setup PM2 to Start on Boot

```bash
pm2 startup
```

This will output a command starting with `sudo`. **Copy and run that command.**

Example output:
```bash
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ec2-user --hp /home/ec2-user
```

Run the command it gives you, then:
```bash
pm2 save
```

Now your app will automatically start when the server reboots!

## Step 6: Test Your Deployment

### 6.1 Test Locally on EC2

```bash
curl http://localhost:3000
curl http://localhost:3000/api
```

### 6.2 Test from Your Browser

1. Get your EC2 **Public IPv4 address** from AWS Console
2. Open browser and visit:
   - **Portfolio**: `http://YOUR_PUBLIC_IP:3000/`
   - **API**: `http://YOUR_PUBLIC_IP:3000/api`

If you see your portfolio or API response, it's working! ✅

## Step 7: Setup Nginx (Optional but Recommended)

Nginx acts as a reverse proxy and can handle SSL/HTTPS.

### 7.1 Install Nginx

**For Amazon Linux:**
```bash
sudo yum install -y nginx
```

**For Ubuntu:**
```bash
sudo apt install -y nginx
```

### 7.2 Configure Nginx

```bash
sudo nano /etc/nginx/conf.d/news-aggregator.conf
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name YOUR_PUBLIC_IP_OR_DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Replace `YOUR_PUBLIC_IP_OR_DOMAIN` with your EC2 public IP or domain name.

Save: `Ctrl+X`, then `Y`, then `Enter`

### 7.3 Test Nginx Configuration

```bash
sudo nginx -t
```

Should show: "syntax is ok" and "test is successful"

### 7.4 Start and Enable Nginx

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl reload nginx
```

### 7.5 Test with Nginx

Now you can access your app on port 80:
- `http://YOUR_PUBLIC_IP/` (no port number needed!)

## Step 8: Setup Domain Name (Optional)

### 8.1 Get a Domain

- AWS Route 53
- Namecheap
- GoDaddy
- Google Domains

### 8.2 Point Domain to EC2

1. In your DNS provider, create an **A record**:
   - **Name**: `@` or `www`
   - **Type**: `A`
   - **Value**: Your EC2 Public IPv4 address
   - **TTL**: 300 (or default)

2. Wait 5-10 minutes for DNS propagation

3. Update Nginx config with your domain:
   ```bash
   sudo nano /etc/nginx/conf.d/news-aggregator.conf
   ```
   Change `server_name` to your domain

4. Reload Nginx:
   ```bash
   sudo systemctl reload nginx
   ```

## Step 9: Setup SSL/HTTPS (Optional)

### 9.1 Install Certbot

**For Amazon Linux:**
```bash
sudo yum install -y certbot python3-certbot-nginx
```

**For Ubuntu:**
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 9.2 Get SSL Certificate

```bash
sudo certbot --nginx -d your-domain.com
```

Follow the prompts. Certbot will automatically configure Nginx for HTTPS.

### 9.3 Auto-Renewal

Certbot sets up auto-renewal automatically. Test it:
```bash
sudo certbot renew --dry-run
```

## Useful Commands Reference

### PM2 Commands

```bash
# View all processes
pm2 status

# View logs
pm2 logs news-aggregator

# View logs (last 100 lines)
pm2 logs news-aggregator --lines 100

# Restart app
pm2 restart news-aggregator

# Stop app
pm2 stop news-aggregator

# Delete app from PM2
pm2 delete news-aggregator

# Monitor (real-time)
pm2 monit

# View environment variables
pm2 env 0

# Reload app (zero downtime)
pm2 reload news-aggregator
```

### Update Your Application

```bash
cd ~/news-aggregator_project-/Afrid_shaik_node
git pull origin main
npm install --production
pm2 restart news-aggregator
```

Or use the deploy script:
```bash
cd ~/news-aggregator_project-/Afrid_shaik_node
./ec2-deploy.sh
```

### View Logs

```bash
# PM2 logs
pm2 logs news-aggregator

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u nginx -f
```

### System Commands

```bash
# Check if app is running
pm2 status

# Check port 3000
sudo netstat -tulpn | grep 3000

# Check Nginx status
sudo systemctl status nginx

# Restart Nginx
sudo systemctl restart nginx

# Check disk space
df -h

# Check memory
free -h

# Check CPU
top
```

## Troubleshooting

### App Won't Start

1. **Check PM2 logs:**
   ```bash
   pm2 logs news-aggregator
   ```

2. **Check if port is in use:**
   ```bash
   sudo netstat -tulpn | grep 3000
   ```

3. **Check environment variables:**
   ```bash
   pm2 env 0
   ```

4. **Try starting manually:**
   ```bash
   cd ~/news-aggregator_project-/Afrid_shaik_node
   node server.js
   ```

### Can't Access from Browser

1. **Check Security Group:**
   - Go to EC2 Console → Security Groups
   - Verify ports 80, 443, 3000 are open
   - Source should be 0.0.0.0/0 for web access

2. **Check if app is running:**
   ```bash
   pm2 status
   ```

3. **Check Nginx:**
   ```bash
   sudo systemctl status nginx
   ```

4. **Test locally on server:**
   ```bash
   curl http://localhost:3000
   ```

5. **Check firewall (if enabled):**
   ```bash
   sudo firewall-cmd --list-all  # For CentOS/RHEL
   sudo ufw status              # For Ubuntu
   ```

### MongoDB Connection Fails

1. **Check MongoDB Atlas:**
   - Go to MongoDB Atlas dashboard
   - Network Access → Add IP Address
   - Add: `0.0.0.0/0` (allows all IPs) OR your EC2 IP
   - Wait 1-2 minutes for changes to apply

2. **Verify MONGODB_URI:**
   ```bash
   pm2 env 0 | grep MONGODB_URI
   ```

3. **Test connection:**
   ```bash
   node -e "const mongoose = require('mongoose'); mongoose.connect('YOUR_URI').then(() => console.log('Connected')).catch(e => console.log(e));"
   ```

### Port Already in Use

```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>
```

### PM2 App Keeps Crashing

1. **Check logs:**
   ```bash
   pm2 logs news-aggregator --err
   ```

2. **Check if MongoDB is connecting:**
   - Look for "MongoDB connected successfully" in logs

3. **Check memory:**
   ```bash
   free -h
   ```
   - If low, consider upgrading instance type

### Nginx 502 Bad Gateway

1. **Check if app is running:**
   ```bash
   pm2 status
   ```

2. **Check Nginx config:**
   ```bash
   sudo nginx -t
   ```

3. **Check Nginx error logs:**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

## Security Best Practices

### 1. Keep System Updated

```bash
# Amazon Linux
sudo yum update -y

# Ubuntu
sudo apt update && sudo apt upgrade -y
```

### 2. Configure Security Groups Properly

- **SSH (22)**: Only allow from your IP
- **HTTP/HTTPS (80/443)**: Allow from anywhere
- **App Port (3000)**: Can restrict or allow anywhere

### 3. Use Strong Passwords

- Change default passwords
- Use SSH keys (already done)
- Don't commit secrets to Git

### 4. Setup Firewall (Optional)

**For Ubuntu:**
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw enable
```

### 5. Regular Backups

- Backup your MongoDB database regularly
- Consider using AWS Backup for EC2 snapshots

## Cost Estimate

### Free Tier (First 12 Months)

- **EC2 t2.micro**: 750 hours/month FREE
- **EBS Storage**: 30 GB FREE
- **Data Transfer**: 1 GB/month FREE

### After Free Tier

- **EC2 t2.micro**: ~$8-10/month
- **EBS Storage (20 GB)**: ~$2/month
- **Data Transfer**: First 1GB free, then $0.09/GB

**Total**: ~$10-15/month for basic setup

## Next Steps After Deployment

1. ✅ **Get your EC2 Public IP**
2. ✅ **Update frontend** to use EC2 URL:
   - `Afrid_shaik_vue/src/App.vue`
   - `Afrid_shaik_vue/src/components/ArticleList.vue`
   - `Afrid_shaik_vue/src/components/ArticleCard.vue`
3. ✅ **Test all endpoints**
4. ✅ **(Optional) Setup domain name**
5. ✅ **(Optional) Setup SSL/HTTPS**

## Quick Deployment Script

You can use the provided scripts:

```bash
# Setup (run once)
cd ~/news-aggregator_project-/Afrid_shaik_node
chmod +x ec2-setup.sh
./ec2-setup.sh

# Deploy/Update (run when updating)
chmod +x ec2-deploy.sh
./ec2-deploy.sh
```

## Your EC2 URLs

After deployment:

- **Direct App**: `http://YOUR_PUBLIC_IP:3000`
- **With Nginx**: `http://YOUR_PUBLIC_IP/` (port 80)
- **With Domain**: `http://your-domain.com/`
- **With SSL**: `https://your-domain.com/`

## Support Resources

- **AWS EC2 Docs**: https://docs.aws.amazon.com/ec2/
- **PM2 Docs**: https://pm2.keymetrics.io/docs/
- **Nginx Docs**: https://nginx.org/en/docs/

---

**EC2 gives you full control and is very reliable! 🚀**

**Your app will be accessible 24/7 (as long as instance is running)**

