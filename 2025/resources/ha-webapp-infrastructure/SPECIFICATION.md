# High Availability Web Application Infrastructure Specification

## Requirements

### Functional Requirements
1. **Load Balancing**: Distribute traffic across multiple web application instances
2. **High Availability**: Automatic failover for all components
3. **Session Management**: Centralized session storage using Redis
4. **Database Replication**: MySQL master-slave replication for data redundancy
5. **Health Monitoring**: Continuous health checks for all services
6. **Infrastructure as Code**: Ansible-based deployment automation

### Non-Functional Requirements
1. **Scalability**: Support horizontal scaling of web applications
2. **Reliability**: 99.9% uptime with automatic failover
3. **Performance**: < 100ms response time for health checks
4. **Security**: Network isolation and authentication between services
5. **Maintainability**: Docker containerization for easy deployment

## Specification

### Architecture Components

#### 1. Load Balancer Layer
- **Technology**: Nginx with Keepalived
- **Configuration**:
  - 2 Nginx instances (nginx1, nginx2)
  - Virtual IP (VIP): 172.20.0.100
  - Health checks every 2 seconds
  - Automatic failover using VRRP
  - Session persistence using ip_hash

#### 2. Application Layer
- **Technology**: Next.js with TypeScript
- **Configuration**:
  - 2 web application instances (web1, web2)
  - Redis session management
  - MySQL database connectivity
  - Health endpoint at `/api/health`
  - Session endpoint at `/api/session`

#### 3. Cache Layer
- **Technology**: Redis
- **Configuration**:
  - Single Redis instance (can be clustered for HA)
  - Persistent storage with AOF
  - Session TTL: 3600 seconds

#### 4. Database Layer
- **Technology**: MySQL 8.0
- **Configuration**:
  - Master-Slave replication
  - Binary logging enabled
  - Automatic failover capability
  - Read-only slave for read scaling

### Network Architecture
```
Internet
    ↓
VIP (172.20.0.100)
    ↓
┌─────────────┐     ┌─────────────┐
│   Nginx 1   │     │   Nginx 2   │
│  (MASTER)   │     │  (BACKUP)   │
└─────────────┘     └─────────────┘
       ↓                   ↓
┌─────────────┐     ┌─────────────┐
│   Web App 1 │     │   Web App 2 │
└─────────────┘     └─────────────┘
       ↓                   ↓
    ┌─────────────────┐
    │      Redis      │
    └─────────────────┘
       ↓           ↓
┌─────────────┐  ┌─────────────┐
│   MySQL 1   │→→│   MySQL 2   │
│  (Master)   │  │   (Slave)   │
└─────────────┘  └─────────────┘
```

### Deployment Process

1. **Infrastructure Setup**
   ```bash
   docker-compose up -d
   ```

2. **Ansible Configuration**
   ```bash
   ansible-playbook -i ansible/inventory.yml ansible/playbook.yml
   ```

3. **Verification**
   - Access application via VIP: http://172.20.0.100
   - Check health status: http://172.20.0.100/api/health
   - Verify session persistence across instances
   - Test failover by stopping nginx1

### Monitoring & Health Checks

#### Health Check Endpoints
- **Nginx**: `/health` - Returns 200 OK
- **Application**: `/api/health` - Returns JSON with service status
- **Redis**: TCP port 6379 connectivity
- **MySQL**: TCP port 3306 connectivity and replication status

#### Monitoring Metrics
- Response time
- Request count
- Error rate
- Service availability
- Database replication lag

### Security Considerations

1. **Network Security**
   - Private network isolation (172.20.0.0/16)
   - No direct database access from outside

2. **Application Security**
   - HttpOnly cookies for sessions
   - Environment-based configuration
   - Secure session storage in Redis

3. **Database Security**
   - Separate replication user
   - Read-only slave configuration
   - Connection pooling with limits

### Disaster Recovery

1. **Backup Strategy**
   - MySQL binary logs for point-in-time recovery
   - Redis AOF persistence
   - Docker volume backups

2. **Recovery Procedures**
   - Automatic failover for Nginx (< 2 seconds)
   - Manual MySQL slave promotion if master fails
   - Redis data restoration from AOF

### Testing Strategy

1. **Unit Tests**
   - API endpoint testing
   - Session management testing
   - Database connection testing

2. **Integration Tests**
   - End-to-end user flow
   - Session persistence across instances
   - Load balancer distribution

3. **Failover Tests**
   - Nginx master failure
   - Application instance failure
   - Redis restart
   - MySQL replication break

## Implementation Status

### Completed Components
- [x] Docker Compose configuration
- [x] Nginx load balancer setup
- [x] Keepalived configuration
- [x] Next.js application with TypeScript
- [x] Redis session management
- [x] MySQL master-slave configuration
- [x] Ansible playbooks
- [x] Health check endpoints

### Repository Structure
```
ha-webapp-infrastructure/
├── docker-compose.yml
├── docker/
│   └── nginx/
│       ├── Dockerfile
│       └── entrypoint.sh
├── nginx/
│   ├── nginx1.conf
│   ├── nginx2.conf
│   ├── keepalived1.conf
│   └── keepalived2.conf
├── webapp/
│   ├── Dockerfile
│   ├── package.json
│   ├── next.config.js
│   └── src/
│       ├── pages/
│       │   ├── index.tsx
│       │   └── api/
│       │       ├── health.ts
│       │       └── session.ts
│       └── lib/
│           ├── redis.ts
│           └── db.ts
├── mysql/
│   ├── master.cnf
│   ├── slave.cnf
│   └── init-master.sql
└── ansible/
    ├── inventory.yml
    ├── playbook.yml
    └── roles/
        └── nginx_lb/
            └── tasks/
                └── main.yml
```

## Internationalization Support

### Current Implementation
The application is prepared for i18n support with the following languages:
- English (EN) - Default
- Japanese (JA) - 日本語

### i18n Configuration (To be implemented)
```typescript
// webapp/src/lib/i18n.ts
export const messages = {
  en: {
    title: "High Availability Web Application",
    serverInfo: "Server Information",
    sessionCounter: "Session Counter",
    healthStatus: "Health Status",
    increment: "Increment Counter",
    updating: "Updating...",
    connected: "Connected",
    disconnected: "Disconnected"
  },
  ja: {
    title: "高可用性Webアプリケーション",
    serverInfo: "サーバー情報",
    sessionCounter: "セッションカウンター",
    healthStatus: "ヘルスステータス",
    increment: "カウンターを増やす",
    updating: "更新中...",
    connected: "接続済み",
    disconnected: "切断"
  }
};
```