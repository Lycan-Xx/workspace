#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Detect operating system
if [[ "$OSTYPE" == "msys"* ]] || [[ "$OSTYPE" == "cygwin"* ]] || [[ "$OSTYPE" == "win"* ]]; then
    POCKETBASE_EXECUTABLE="./pocketbase.exe"
else
    POCKETBASE_EXECUTABLE="./pocketbase"
fi

# Check if pocketbase executable exists
if [ ! -f "$POCKETBASE_EXECUTABLE" ]; then
    echo "Error: PocketBase executable not found in $SCRIPT_DIR"
    echo "Please ensure $POCKETBASE_EXECUTABLE is installed in the backend directory"
    exit 1
fi

# Make executable (only for Unix-like systems)
if [[ "$OSTYPE" != "msys"* ]] && [[ "$OSTYPE" != "cygwin"* ]] && [[ "$OSTYPE" != "win"* ]]; then
    chmod +x "$POCKETBASE_EXECUTABLE"
fi

# Start PocketBase server with CORS enabled
echo "Starting PocketBase server from $SCRIPT_DIR..."

# Get the Replit frontend domain from environment or use wildcard for development
if [ -n "$REPL_SLUG" ]; then
    FRONTEND_DOMAIN="https://$REPL_SLUG-00-$REPL_ID.janeway.replit.dev"
    echo "Setting CORS for frontend domain: $FRONTEND_DOMAIN"
    "$POCKETBASE_EXECUTABLE" serve --http=0.0.0.0:8090 --origins="$FRONTEND_DOMAIN,https://*.replit.dev"
else
    echo "Development mode - allowing all origins"
    "$POCKETBASE_EXECUTABLE" serve --http=0.0.0.0:8090 --origins="*"
fi
