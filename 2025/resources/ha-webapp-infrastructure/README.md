# High Availability Web Application Infrastructure

A production-ready, highly available web application infrastructure using Docker, Ansible, Nginx, Redis, and MySQL.

## Features

- **Load Balancing**: Dual Nginx instances with Keepalived for automatic failover
- **Session Management**: Centralized Redis session store
- **Database Replication**: MySQL master-slave configuration
- **Infrastructure as Code**: Ansible automation
- **Health Monitoring**: Built-in health check endpoints
- **Containerization**: Full Docker support

## Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd ha-webapp-infrastructure
```

2. **Start the infrastructure**
```bash
docker-compose up -d
```

3. **Run verification tests**
```bash
./test-infrastructure.sh
```

4. **Access the application**
- Load Balancer VIP: http://localhost:8080 (when configured)
- Nginx 1: http://localhost:8081
- Nginx 2: http://localhost:8082
- Redis: localhost:6379
- MySQL Master: localhost:3306
- MySQL Slave: localhost:3307

## Architecture

```
        Internet
            ↓
    VIP (172.20.0.100)
            ↓
    [Nginx + Keepalived]
        ↓         ↓
    [Web App 1] [Web App 2]
        ↓         ↓
        [Redis]
        ↓     ↓
    [MySQL]→[MySQL]
    Master   Slave
```

## Testing

Run the comprehensive test suite:
```bash
./test-infrastructure.sh
```

This will verify:
- Service availability
- Session persistence
- Nginx failover
- MySQL replication
- Load distribution

## Monitoring

Check application health:
```bash
curl http://localhost:8081/api/health
```

View logs:
```bash
docker-compose logs -f [service_name]
```

## Stopping

To stop all services:
```bash
docker-compose down
```

To stop and remove volumes:
```bash
docker-compose down -v
```

## Documentation

- [Full Specification](./SPECIFICATION.md)
- [Ansible Playbooks](./ansible/)
- [Docker Configuration](./docker-compose.yml)

## License

MIT