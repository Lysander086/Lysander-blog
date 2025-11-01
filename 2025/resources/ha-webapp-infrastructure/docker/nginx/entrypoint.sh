#!/bin/bash

# Start keepalived in background
keepalived -f /etc/keepalived/keepalived.conf -l -D

# Start nginx in foreground
nginx -g 'daemon off;'