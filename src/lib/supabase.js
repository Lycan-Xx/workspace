import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Development environment check
const isDevelopment = import.meta.env.DEV;

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = 'Missing Supabase environment variables. Please check your .env file.';
  console.error('Supabase Configuration Error:', errorMessage);
  throw new Error(errorMessage);
}

// Log configuration in development
if (isDevelopment) {
  console.log('Supabase Configuration:', {
    url: supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
    environment: 'development'
  });
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Development-optimized settings
    disableSignupEmailVerification: true,
    flowType: 'implicit',
    // Enhanced session management
    storage: window?.localStorage,
    storageKey: 'evault-auth-token',
    // Development-friendly debugging
    debug: isDevelopment
  },
  // Global configuration
  global: {
    headers: {
      'X-Client-Info': 'evault-web-app'
    }
  }
});

// Enhanced error handling helper
const handleSupabaseError = (error, operation) => {
  const errorDetails = {
    operation,
    message: error.message,
    code: error.code || 'UNKNOWN_ERROR',
    timestamp: new Date().toISOString()
  };

  if (isDevelopment) {
    console.error('Supabase Error:', errorDetails, error);
  }

  return {
    success: false,
    error: error.message,
    code: error.code,
    details: isDevelopment ? errorDetails : undefined
  };
};

// Helper function to get current user with enhanced error handling
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      if (isDevelopment) {
        console.error('getCurrentUser error:', error);
      }
      throw error;
    }

    if (isDevelopment && user) {
      console.log('Current user retrieved:', {
        id: user.id,
        email: user.email,
        hasMetadata: !!user.user_metadata
      });
    }

    return user;
  } catch (error) {
    throw handleSupabaseError(error, 'getCurrentUser');
  }
};

// Helper function to get session with enhanced error handling
export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      if (isDevelopment) {
        console.error('getSession error:', error);
      }
      throw error;
    }

    if (isDevelopment) {
      console.log('Session retrieved:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        expiresAt: session?.expires_at
      });
    }

    return session;
  } catch (error) {
    throw handleSupabaseError(error, 'getSession');
  }
};

// Test Supabase connection
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Supabase connection test failed:', error);
      return { success: false, error: error.message };
    }

    if (isDevelopment) {
      console.log('Supabase connection test successful:', {
        connected: true,
        hasSession: !!data.session,
        timestamp: new Date().toISOString()
      });
    }

    return { success: true, connected: true };
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return { success: false, error: error.message };
  }
};

// Initialize connection test in development
if (isDevelopment) {
  testSupabaseConnection().then(result => {
    if (result.success) {
      console.log('✅ Supabase connection established successfully');
    } else {
      console.error('❌ Supabase connection failed:', result.error);
    }
  });
}