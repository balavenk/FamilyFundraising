#!/bin/bash

# Build the Next.js application
npm run build

# Create data directory if it doesn't exist
mkdir -p /path/to/your/app/data
chmod 755 /path/to/your/app/data

# Set proper permissions
chown -R www-data:www-data /path/to/your/app/data

# Restart the Next.js server
pm2 restart your-app-name

# Reload Nginx configuration
nginx -s reload

echo "Deployment completed successfully!"
