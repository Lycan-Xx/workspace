/**
 * Test Setup Configuration
 * 
 * This file sets up the testing environment for authentication tests
 */

import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    origin: 'http://localhost:3000',
    href: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
  },
  writable: true,
});

// Mock console methods for cleaner test output
const originalConsole = { ...console };

// Setup console mocking
beforeEach(() => {
  // Reset localStorage mock
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
  
  // Mock console methods to reduce noise in tests
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  // Restore console methods
  console.log.mockRestore?.();
  console.warn.mockRestore?.();
  console.error.mockRestore?.();
});

// Global test utilities
global.testUtils = {
  // Helper to wait for async operations
  wait: (ms = 100) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Helper to generate unique test emails
  generateTestEmail: (prefix = 'test') => `${prefix}.${Date.now()}@example.com`,
  
  // Helper to create test user data
  createTestUserData: (type = 'personal', overrides = {}) => {
    const baseData = {
      password: 'TestPassword123!',
      confirmPassword: 'TestPassword123!',
      phone: '+2341234567890',
      ...overrides
    };
    
    if (type === 'personal') {
      return {
        ...baseData,
        email: global.testUtils.generateTestEmail('personal'),
        account_type: 'personal',
        first_name: 'Test',
        last_name: 'User',
        ...overrides
      };
    } else if (type === 'business') {
      return {
        ...baseData,
        email: global.testUtils.generateTestEmail('business'),
        account_type: 'business',
        business_name: 'Test Business Corp',
        rc_number: 'RC123456',
        nin: '12345678901',
        ...overrides
      };
    }
    
    return baseData;
  },
  
  // Helper to clean up test data
  cleanup: async () => {
    try {
      // Clear localStorage
      localStorage.clear();
      
      // Sign out from Supabase if available
      if (typeof window !== 'undefined' && window.supabase) {
        await window.supabase.auth.signOut();
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  }
};

// Mock environment variables if not set
if (!process.env.VITE_SUPABASE_URL) {
  process.env.VITE_SUPABASE_URL = 'http://localhost:54321';
}

if (!process.env.VITE_SUPABASE_ANON_KEY) {
  process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key';
}

console.log('🧪 Test environment setup completed');