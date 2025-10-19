#!/bin/sh
set -e

# Replace environment variables in config.js
envsubst < /usr/share/nginx/html/config.js > /tmp/config.js
mv /tmp/config.js /usr/share/nginx/html/config.js

# Start nginx
exec nginx -g 'daemon off;'