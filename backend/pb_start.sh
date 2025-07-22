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

# Start PocketBase server
echo "Starting PocketBase server from $SCRIPT_DIR..."
./pocketbase serve --http=0.0.0.0:8090
