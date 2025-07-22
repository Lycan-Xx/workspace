
# PocketBase Setup Guide for eVault

## Initial Setup

1. **Start PocketBase**
   ```bash
   npm run start:backend
   ```

2. **Access Admin Panel**
   - Open http://localhost:8090/_/
   - Create an admin account when prompted

## Collection Setup

### 1. Users Collection (Auth)
The default `users` collection needs to be extended with these fields:

```json
{
  "firstName": "text" (required),
  "lastName": "text" (required), 
  "phone": "text" (required),
  "accountType": "select" (required) - values: ["personal", "business"],
  "tier": "select" - values: ["tier1", "tier2", "tier3"],
  "balance": "number",
  "securityPin": "text",
  "isVerified": "bool",
  "lastLoginTime": "date"
}
```

### 2. Transactions Collection
Create a new `transactions` collection:

```json
{
  "userId": "relation" (required) - links to users,
  "type": "select" (required) - values: ["transfer", "deposit", "withdrawal", "payment", "airtime", "data", "electricity", "cable"],
  "amount": "number" (required),
  "recipient": "text",
  "description": "text", 
  "status": "select" (required) - values: ["pending", "completed", "failed", "cancelled"],
  "reference": "text"
}
```

## Authentication Rules

### Users Collection Rules:
- **List/Search Rule**: `@request.auth.id != ""`
- **View Rule**: `@request.auth.id != "" && (@request.auth.id = id || @request.auth.role = "admin")`
- **Create Rule**: `@request.data.email != "" && @request.data.password != ""`
- **Update Rule**: `@request.auth.id = id`
- **Delete Rule**: `@request.auth.id = id`

### Transactions Collection Rules:
- **List/Search Rule**: `@request.auth.id != "" && userId = @request.auth.id`
- **View Rule**: `@request.auth.id != "" && userId = @request.auth.id`
- **Create Rule**: `@request.auth.id != "" && userId = @request.auth.id`
- **Update Rule**: `@request.auth.id != "" && userId = @request.auth.id`
- **Delete Rule**: `@request.auth.id != "" && userId = @request.auth.id`

## API Configuration

The frontend is configured to connect to PocketBase at:
- Development: `http://localhost:8090`
- Replit: Auto-detected based on hostname

## Next Steps

1. Start PocketBase: `npm run start:backend`
2. Set up admin account at http://localhost:8090/_/
3. Create the collections with the schemas above
4. Configure the authentication rules
5. Test the connection with the frontend

## Scripts Available

- `npm run backend` - Start PocketBase only
- `npm run start:backend` - Start PocketBase with permissions
- `npm run start:full` - Start both frontend and backend
- `npm run dev` - Start frontend only
