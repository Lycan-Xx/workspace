# Backend Setup

## PocketBase Startup Script

The `pb_start.sh` script is designed to handle cross-platform execution of PocketBase in our development environment.

### Operating System Detection

The script includes OS detection for several important reasons:

1. **Executable Differences**
   - Windows uses `pocketbase.exe`
   - Unix-like systems use `pocketbase`

2. **Permission Handling**
   - Unix systems require explicit permission setting (`chmod +x`)
   - Windows doesn't use the same permission system

3. **Path Compatibility**
   - Ensures correct path handling across different operating systems
   - Maintains consistent behavior regardless of the development environment

### How It Works

```bash
if [[ "$OSTYPE" == "msys"* ]] || [[ "$OSTYPE" == "cygwin"* ]] || [[ "$OSTYPE" == "win"* ]]; then
    POCKETBASE_EXECUTABLE="./pocketbase.exe"
else
    POCKETBASE_EXECUTABLE="./pocketbase"
```


This check:
- Detects if running on Windows (including Git Bash, Cygwin)
- Selects the appropriate executable name
- Ensures the script works without modification on any supported platform

### Requirements

- Windows: Ensure `pocketbase.exe` is present in the backend directory
- Unix/Linux/MacOS: Ensure `pocketbase` is present in the backend directory
- Bash shell (Git Bash on Windows)

### Usage

Run from project root:
```bash
npm run start:backend
```

Or directly:
```bash
bash ./backend/pb_start.sh
```