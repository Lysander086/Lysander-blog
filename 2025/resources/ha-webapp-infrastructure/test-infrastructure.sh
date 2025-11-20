#!/bin/bash

echo "=== High Availability Infrastructure Verification Script ==="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
    fi
}

# Start infrastructure
echo "Starting infrastructure..."
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to initialize..."
sleep 30

echo ""
echo "=== Service Health Checks ==="

# Check Nginx instances
echo -n "Checking Nginx 1... "
curl -s -f http://localhost:8081/health > /dev/null 2>&1
print_status $? "Nginx 1 is responsive"

echo -n "Checking Nginx 2... "
curl -s -f http://localhost:8082/health > /dev/null 2>&1
print_status $? "Nginx 2 is responsive"

# Check Redis
echo -n "Checking Redis... "
docker exec redis redis-cli ping | grep -q PONG
print_status $? "Redis is responsive"

# Check MySQL Master
echo -n "Checking MySQL Master... "
docker exec mysql1 mysql -uroot -prootpass -e "SELECT 1" > /dev/null 2>&1
print_status $? "MySQL Master is responsive"

# Check MySQL Slave
echo -n "Checking MySQL Slave... "
docker exec mysql2 mysql -uroot -prootpass -e "SELECT 1" > /dev/null 2>&1
print_status $? "MySQL Slave is responsive"

echo ""
echo "=== Application Tests ==="

# Test session persistence
echo -n "Testing session creation... "
SESSION_RESPONSE=$(curl -s -X POST http://localhost:8081/api/session \
    -H "Content-Type: application/json" \
    -d '{"test": "data", "counter": 1}')
if echo "$SESSION_RESPONSE" | grep -q "Session saved"; then
    print_status 0 "Session created successfully"
else
    print_status 1 "Session creation failed"
fi

# Extract session ID from cookie header
echo -n "Testing session retrieval... "
SESSION_GET=$(curl -s http://localhost:8082/api/session)
if echo "$SESSION_GET" | grep -q "sessionId"; then
    print_status 0 "Session retrieved successfully"
else
    print_status 1 "Session retrieval failed"
fi

echo ""
echo "=== Failover Test ==="

# Test VIP failover
echo "Testing Nginx failover..."
echo -n "Stopping Nginx 1 (Master)... "
docker stop nginx1 > /dev/null 2>&1
print_status $? "Nginx 1 stopped"

sleep 5

echo -n "Checking if Nginx 2 took over... "
curl -s -f http://localhost:8082/health > /dev/null 2>&1
print_status $? "Nginx 2 is now active"

echo -n "Restarting Nginx 1... "
docker start nginx1 > /dev/null 2>&1
print_status $? "Nginx 1 restarted"

echo ""
echo "=== MySQL Replication Test ==="

# Check replication status
echo -n "Checking replication status... "
SLAVE_STATUS=$(docker exec mysql2 mysql -uroot -prootpass -e "SHOW SLAVE STATUS\G" 2>/dev/null)
if echo "$SLAVE_STATUS" | grep -q "Slave_IO_Running: Yes" && \
   echo "$SLAVE_STATUS" | grep -q "Slave_SQL_Running: Yes"; then
    print_status 0 "MySQL replication is working"
else
    print_status 1 "MySQL replication is not working"
fi

echo ""
echo "=== Load Distribution Test ==="

# Test load distribution
echo "Sending 10 requests to check load distribution..."
declare -A server_counts
for i in {1..10}; do
    RESPONSE=$(curl -s http://localhost:8081/api/health)
    SERVER=$(echo "$RESPONSE" | grep -o '"server":"[^"]*"' | cut -d'"' -f4)
    ((server_counts[$SERVER]++))
done

echo "Request distribution:"
for server in "${!server_counts[@]}"; do
    echo "  $server: ${server_counts[$server]} requests"
done

echo ""
echo "=== Test Summary ==="
echo "Infrastructure verification complete!"
echo ""
echo "To stop the infrastructure, run:"
echo "  docker-compose down"
echo ""
echo "To view logs, run:"
echo "  docker-compose logs -f [service_name]"