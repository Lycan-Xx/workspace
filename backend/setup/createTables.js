
import { supabaseAdmin } from '../supabase/config.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setupDatabase() {
  console.log('🚀 Setting up Supabase database...');
  
  try {
    // Read and execute schema
    const schemaPath = join(__dirname, '../supabase/schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');
    
    console.log('📝 Executing database schema...');
    
    // Split schema into individual statements and execute them
    const statements = schema.split(';').filter(statement => statement.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          const { error } = await supabaseAdmin.rpc('exec_sql', { 
            sql: statement.trim() + ';' 
          });
          
          if (error && !error.message.includes('already exists')) {
            console.warn('⚠️  Warning:', error.message);
          }
        } catch (err) {
          console.warn('⚠️  Statement warning:', err.message);
        }
      }
    }
    
    console.log('✅ Database setup completed successfully!');
    console.log('');
    console.log('🎯 Next steps:');
    console.log('1. Update your .env file with Supabase credentials');
    console.log('2. Start the backend server: npm run dev');
    console.log('3. Update your frontend .env with backend URL');
    console.log('4. Test authentication endpoints');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
