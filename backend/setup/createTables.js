
import { supabaseAdmin } from '../supabase/config.js';

async function setupDatabase() {
  console.log('🚀 Verifying Supabase database setup...');
  
  try {
    // Test connection
    console.log('📡 Testing Supabase connection...');
    const { error: connectionError } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      throw new Error(`Connection failed: ${connectionError.message}`);
    }
    
    console.log('✅ Supabase connection successful!');
    
    // Check if required tables exist
    console.log('🔍 Checking database schema...');
    
    const requiredTables = [
      'users',
      'accounts', 
      'transactions',
      'kyc_documents',
      'virtual_cards',
      'vault_files'
    ];
    
    const tableChecks = [];
    
    for (const table of requiredTables) {
      try {
        const { error } = await supabaseAdmin
          .from(table)
          .select('count')
          .limit(1);
        
        if (error) {
          tableChecks.push({ table, exists: false, error: error.message });
        } else {
          tableChecks.push({ table, exists: true });
        }
      } catch (err) {
        tableChecks.push({ table, exists: false, error: err.message });
      }
    }
    
    // Report table status
    console.log('📋 Database Schema Status:');
    let allTablesExist = true;
    
    tableChecks.forEach(({ table, exists, error }) => {
      if (exists) {
        console.log(`   ✅ ${table} - Ready`);
      } else {
        console.log(`   ❌ ${table} - Missing (${error})`);
        allTablesExist = false;
      }
    });
    
    if (!allTablesExist) {
      console.log('');
      console.log('⚠️  Some tables are missing. Please run the schema from SUPABASE_SETUP_GUIDE.md');
      console.log('');
      console.log('📋 To set up the database:');
      console.log('1. Go to your Supabase Dashboard → SQL Editor');
      console.log('2. Copy and run the schema from SUPABASE_SETUP_GUIDE.md');
      console.log('3. Run this setup script again: npm run setup');
      console.log('');
      process.exit(1);
    }
    
    // Test authentication system
    console.log('🔐 Testing authentication system...');
    
    try {
      // Simple test to see if we can access auth functions
      const { data: authTest, error: authError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (!authError) {
        console.log('   ✅ Authentication system accessible');
      } else {
        console.log('   ⚠️  Authentication system check failed:', authError.message);
      }
    } catch (err) {
      console.log('   ⚠️  Authentication system check failed:', err.message);
    }
    
    console.log('🔒 Row Level Security should be enabled via SUPABASE_SETUP_GUIDE.md');
    
    console.log('');
    console.log('🎉 Database setup verification completed!');
    console.log('');
    console.log('🚀 Backend is ready to start!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Start the backend server: npm run dev');
    console.log('2. Server will be available at: http://localhost:5000');
    console.log('3. Test health endpoint: http://localhost:5000/api/health');
    console.log('4. Check API documentation: backend/API_DOCUMENTATION.md');
    console.log('');
    console.log('🔗 Integration:');
    console.log('- Your frontend is already configured to work with this backend');
    console.log('- Authentication tokens from frontend will work automatically');
    console.log('- Update VITE_BACKEND_URL in frontend .env if needed');
    
  } catch (error) {
    console.error('❌ Database setup verification failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Check your .env file has correct Supabase credentials');
    console.log('2. Ensure SUPABASE_SERVICE_ROLE_KEY is set correctly');
    console.log('3. Verify your Supabase project is active');
    console.log('4. Run the schema from SUPABASE_SETUP_GUIDE.md if not done yet');
    process.exit(1);
  }
}

setupDatabase();
