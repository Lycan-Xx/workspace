#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check if pocketbase executable exists
if [ ! -f "./pocketbase" ]; then
    echo "Error: PocketBase executable not found in $SCRIPT_DIR"
    echo "Please ensure pocketbase is installed in the backend directory"
    exit 1
fi

# Make sure pocketbase is executable
chmod +x ./pocketbase

# Start PocketBase server with CORS enabled
echo "Starting PocketBase server from $SCRIPT_DIR..."

# Get the Replit frontend domain from environment or use wildcard for development
if [ -n "$REPL_SLUG" ]; then
    FRONTEND_DOMAIN="https://$REPL_SLUG-00-$REPL_ID.janeway.replit.dev"
    echo "Setting CORS for frontend domain: $FRONTEND_DOMAIN"
    ./pocketbase serve --http=0.0.0.0:8090 --origins="$FRONTEND_DOMAIN,https://*.replit.dev"
else
    echo "Development mode - allowing all origins"
    ./pocketbase serve --http=0.0.0.0:8090 --origins="*"
fi
