
const PocketBase = require('pocketbase');

const pb = new PocketBase('http://127.0.0.1:8090');

async function setupCollections() {
  try {
    // Create admin account (you'll need to set this up manually first)
    console.log('Setting up PocketBase collections...');

    // Users collection schema (extends the default users collection)
    const usersSchema = {
      name: "users",
      type: "auth",
      schema: [
        {
          name: "firstName",
          type: "text",
          required: true
        },
        {
          name: "lastName", 
          type: "text",
          required: true
        },
        {
          name: "phone",
          type: "text",
          required: true
        },
        {
          name: "accountType",
          type: "select",
          required: true,
          options: {
            values: ["personal", "business"]
          }
        },
        {
          name: "tier",
          type: "select",
          required: false,
          options: {
            values: ["tier1", "tier2", "tier3"]
          }
        },
        {
          name: "balance",
          type: "number",
          required: false
        },
        {
          name: "securityPin",
          type: "text",
          required: false
        },
        {
          name: "isVerified",
          type: "bool",
          required: false
        },
        {
          name: "lastLoginTime",
          type: "date",
          required: false
        }
      ]
    };

    // Transactions collection
    const transactionsSchema = {
      name: "transactions",
      type: "base",
      schema: [
        {
          name: "userId",
          type: "relation",
          required: true,
          options: {
            collectionId: "_pb_users_auth_",
            cascadeDelete: true
          }
        },
        {
          name: "type",
          type: "select",
          required: true,
          options: {
            values: ["transfer", "deposit", "withdrawal", "payment", "airtime", "data", "electricity", "cable"]
          }
        },
        {
          name: "amount",
          type: "number",
          required: true
        },
        {
          name: "recipient",
          type: "text",
          required: false
        },
        {
          name: "description",
          type: "text",
          required: false
        },
        {
          name: "status",
          type: "select",
          required: true,
          options: {
            values: ["pending", "completed", "failed", "cancelled"]
          }
        },
        {
          name: "reference",
          type: "text",
          required: false
        }
      ]
    };

    console.log('Collections setup completed!');
    console.log('Please create these collections manually in PocketBase Admin UI:');
    console.log('1. Users collection (extends default auth)');
    console.log('2. Transactions collection');
    console.log('\nCollection schemas are defined in this file for reference.');

  } catch (error) {
    console.error('Setup error:', error);
  }
}

setupCollections();
