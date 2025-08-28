# eVault Backend Deployment Guide

## Overview

This guide covers deploying the eVault Backend API to production environments with proper security, monitoring, and scalability considerations.

## Prerequisites

- Node.js 18+ installed
- Supabase project configured
- Domain name and SSL certificate
- Production database setup

## Environment Setup

### 1. Environment Variables

Create a `.env` file with production values:

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Frontend Configuration
FRONTEND_URL=https://your-frontend-domain.com

# Security
JWT_SECRET=your-super-secure-jwt-secret
ENCRYPTION_KEY=your-32-character-encryption-key

# External Services (Production)
SMS_PROVIDER_API_KEY=your-sms-api-key
PAYMENT_PROVIDER_API_KEY=your-payment-api-key

# Monitoring
LOG_LEVEL=info
SENTRY_DSN=your-sentry-dsn

# File Storage
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_BUCKET_NAME=your-s3-bucket
AWS_REGION=us-east-1
```

### 2. Production Dependencies

Install production dependencies:

```bash
npm ci --only=production
```

## Deployment Options

### Option 1: Traditional VPS/Server

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Create application user
sudo useradd -m -s /bin/bash evault
sudo usermod -aG sudo evault
```

#### 2. Application Deployment

```bash
# Clone repository
git clone https://github.com/your-org/evault-backend.git
cd evault-backend

# Install dependencies
npm ci --only=production

# Set up environment
cp .env.example .env
# Edit .env with production values

# Create uploads directory
mkdir -p uploads/kyc
chmod 755 uploads/kyc

# Start with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

#### 3. PM2 Configuration

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'evault-backend',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
```

#### 4. Nginx Configuration

Create `/etc/nginx/sites-available/evault-backend`:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # File upload size
    client_max_body_size 10M;

    # Logging
    access_log /var/log/nginx/evault-backend.access.log;
    error_log /var/log/nginx/evault-backend.error.log;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/evault-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Option 2: Docker Deployment

#### 1. Dockerfile

```dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production

# Bundle app source
COPY . .

# Create uploads directory
RUN mkdir -p uploads/kyc && chmod 755 uploads/kyc

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S evault -u 1001

# Change ownership
RUN chown -R evault:nodejs /usr/src/app
USER evault

EXPOSE 5000

CMD ["node", "server.js"]
```

#### 2. Docker Compose

```yaml
version: '3.8'

services:
  evault-backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    volumes:
      - ./uploads:/usr/src/app/uploads
      - ./logs:/usr/src/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - evault-backend
    restart: unless-stopped
```

#### 3. Deploy with Docker

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f evault-backend

# Scale if needed
docker-compose up -d --scale evault-backend=3
```

### Option 3: Cloud Deployment (AWS/GCP/Azure)

#### AWS Elastic Beanstalk

1. Install EB CLI:
```bash
pip install awsebcli
```

2. Initialize and deploy:
```bash
eb init evault-backend
eb create production
eb deploy
```

3. Configure environment variables in EB console.

#### Google Cloud Run

1. Build and push image:
```bash
gcloud builds submit --tag gcr.io/PROJECT-ID/evault-backend
```

2. Deploy:
```bash
gcloud run deploy --image gcr.io/PROJECT-ID/evault-backend --platform managed
```

## Security Hardening

### 1. Server Security

```bash
# Firewall setup
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# Fail2ban for SSH protection
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

### 2. Application Security

Add security middleware to your Express app:

```javascript
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts'
});

app.use('/api/auth/', authLimiter);
```

### 3. Database Security

- Enable Row Level Security (RLS) in Supabase
- Use service role key only on backend
- Implement proper backup strategy
- Monitor for suspicious activity

## Monitoring and Logging

### 1. Application Monitoring

Install monitoring tools:

```bash
npm install winston morgan sentry
```

Configure logging:

```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

### 2. Health Checks

Implement comprehensive health checks:

```javascript
app.get('/api/health', async (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    services: {}
  };

  // Check Supabase connection
  try {
    await supabaseAdmin.from('users').select('count').limit(1);
    health.services.database = 'healthy';
  } catch (error) {
    health.services.database = 'unhealthy';
    health.status = 'DEGRADED';
  }

  const statusCode = health.status === 'OK' ? 200 : 503;
  res.status(statusCode).json(health);
});
```

### 3. Performance Monitoring

Use tools like:
- **New Relic** for APM
- **DataDog** for infrastructure monitoring
- **Sentry** for error tracking
- **Prometheus + Grafana** for metrics

## Backup and Recovery

### 1. Database Backups

Supabase provides automatic backups, but also implement:

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backups/backup_$DATE.sql
aws s3 cp backups/backup_$DATE.sql s3://your-backup-bucket/
```

### 2. File Backups

```bash
# Backup uploaded files
rsync -av uploads/ s3://your-backup-bucket/uploads/
```

### 3. Recovery Procedures

Document recovery procedures:
1. Database restoration from backup
2. File restoration from S3
3. Application deployment rollback
4. DNS failover procedures

## Performance Optimization

### 1. Caching

Implement Redis caching:

```javascript
import redis from 'redis';

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

// Cache frequently accessed data
const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    const key = req.originalUrl;
    const cached = await client.get(key);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    res.sendResponse = res.json;
    res.json = (body) => {
      client.setex(key, duration, JSON.stringify(body));
      res.sendResponse(body);
    };
    
    next();
  };
};
```

### 2. Database Optimization

- Add proper indexes
- Use connection pooling
- Implement query optimization
- Monitor slow queries

### 3. Load Balancing

Use multiple instances behind a load balancer:

```nginx
upstream evault_backend {
    server 127.0.0.1:5000;
    server 127.0.0.1:5001;
    server 127.0.0.1:5002;
}

server {
    location / {
        proxy_pass http://evault_backend;
    }
}
```

## Maintenance

### 1. Regular Updates

```bash
# Update dependencies
npm audit
npm update

# Security patches
npm audit fix
```

### 2. Log Rotation

Configure logrotate:

```bash
# /etc/logrotate.d/evault-backend
/path/to/evault-backend/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 evault evault
    postrotate
        pm2 reload evault-backend
    endscript
}
```

### 3. Monitoring Scripts

Create monitoring scripts:

```bash
#!/bin/bash
# check-health.sh

HEALTH_URL="https://api.yourdomain.com/api/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ $RESPONSE -ne 200 ]; then
    echo "Health check failed: $RESPONSE"
    # Send alert
    curl -X POST -H 'Content-type: application/json' \
        --data '{"text":"eVault Backend health check failed"}' \
        $SLACK_WEBHOOK_URL
fi
```

## Troubleshooting

### Common Issues

1. **High Memory Usage**
   - Check for memory leaks
   - Increase swap space
   - Optimize queries

2. **Database Connection Issues**
   - Check connection limits
   - Verify credentials
   - Monitor connection pool

3. **File Upload Issues**
   - Check disk space
   - Verify permissions
   - Monitor upload directory

### Debug Mode

Enable debug mode for troubleshooting:

```bash
DEBUG=* NODE_ENV=development npm start
```

## Rollback Procedures

1. **Code Rollback**
```bash
git checkout previous-stable-tag
pm2 reload evault-backend
```

2. **Database Rollback**
```bash
pg_restore -d $DATABASE_URL backup_file.sql
```

3. **DNS Failover**
- Update DNS records to point to backup server
- Verify health checks pass

---

## Checklist

### Pre-deployment
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database migrations run
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Monitoring setup
- [ ] Backup procedures tested

### Post-deployment
- [ ] Health checks passing
- [ ] Logs are being written
- [ ] Monitoring alerts configured
- [ ] Performance metrics baseline established
- [ ] Documentation updated
- [ ] Team notified

---

**Version**: 2.0.0  
**Last Updated**: January 2024