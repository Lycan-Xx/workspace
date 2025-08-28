/**
 * Authentication Flow Debugger
 * Provides comprehensive debugging and tracing for authentication operations
 */

class AuthDebugger {
  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'development';
    this.traces = [];
    this.maxTraces = 100; // Keep last 100 traces
    this.sessionId = this.generateSessionId();
  }

  generateSessionId() {
    return `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Log authentication operations with detailed context
  logAuthOperation(operation, data = {}, level = 'info') {
    if (!this.isEnabled) return;

    const timestamp = new Date().toISOString();
    const trace = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      sessionId: this.sessionId,
      timestamp,
      operation,
      level,
      data: this.sanitizeData(data),
      stack: new Error().stack
    };

    // Add to traces array
    this.traces.push(trace);
    if (this.traces.length > this.maxTraces) {
      this.traces.shift();
    }

    // Console logging with enhanced formatting
    const emoji = this.getEmojiForOperation(operation, level);
    const color = this.getColorForLevel(level);
    
    console.group(`${emoji} Auth Debug: ${operation}`);
    console.log(`%c${timestamp}`, `color: ${color}; font-weight: bold;`);
    
    if (Object.keys(data).length > 0) {
      console.log('Data:', this.formatDataForConsole(data));
    }
    
    if (level === 'error' && data.error) {
      console.error('Error Details:', data.error);
    }
    
    console.groupEnd();

    // Store in sessionStorage for debugging
    this.updateSessionStorage();
  }

  // Sanitize sensitive data for logging
  sanitizeData(data) {
    const sanitized = { ...data };
    const sensitiveKeys = ['password', 'token', 'access_token', 'refresh_token', 'confirmPassword'];
    
    const sanitizeObject = (obj) => {
      if (typeof obj !== 'object' || obj === null) return obj;
      
      const result = Array.isArray(obj) ? [] : {};
      
      for (const [key, value] of Object.entries(obj)) {
        if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive.toLowerCase()))) {
          result[key] = '[REDACTED]';
        } else if (typeof value === 'object' && value !== null) {
          result[key] = sanitizeObject(value);
        } else {
          result[key] = value;
        }
      }
      
      return result;
    };

    return sanitizeObject(sanitized);
  }

  // Format data for better console display
  formatDataForConsole(data) {
    const formatted = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (key === 'userInput' && value) {
        formatted[key] = {
          email: value.email || '[not provided]',
          accountType: value.account_type || '[not provided]',
          hasPassword: !!value.password
        };
      } else if (key === 'user' && value) {
        formatted[key] = {
          id: value.id,
          email: value.email,
          name: value.name,
          role: value.role,
          tier: value.tier
        };
      } else if (key === 'session' && value) {
        formatted[key] = {
          hasAccessToken: !!value.access_token,
          hasRefreshToken: !!value.refresh_token,
          expiresAt: value.expires_at ? new Date(value.expires_at * 1000).toISOString() : null
        };
      } else {
        formatted[key] = value;
      }
    }
    
    return formatted;
  }

  // Get emoji for operation type
  getEmojiForOperation(operation, level) {
    if (level === 'error') return '❌';
    if (level === 'warn') return '⚠️';
    
    const emojiMap = {
      'signup': '📝',
      'login': '🔐',
      'logout': '🚪',
      'session_init': '🚀',
      'session_restore': '🔄',
      'session_validate': '✅',
      'session_expire': '⏰',
      'token_refresh': '🔄',
      'user_fetch': '👤',
      'state_update': '📊',
      'navigation': '🧭',
      'error_handle': '🛠️'
    };
    
    return emojiMap[operation] || '🔍';
  }

  // Get color for log level
  getColorForLevel(level) {
    const colorMap = {
      'info': '#2196F3',
      'success': '#4CAF50',
      'warn': '#FF9800',
      'error': '#F44336'
    };
    
    return colorMap[level] || '#666';
  }

  // Update sessionStorage with traces
  updateSessionStorage() {
    try {
      sessionStorage.setItem('auth_debug_traces', JSON.stringify({
        sessionId: this.sessionId,
        traces: this.traces.slice(-50), // Keep last 50 traces in storage
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.warn('Failed to update sessionStorage with debug traces:', error);
    }
  }

  // Get all traces
  getTraces() {
    return this.traces;
  }

  // Get traces by operation
  getTracesByOperation(operation) {
    return this.traces.filter(trace => trace.operation === operation);
  }

  // Get recent traces (last N)
  getRecentTraces(count = 10) {
    return this.traces.slice(-count);
  }

  // Clear all traces
  clearTraces() {
    this.traces = [];
    sessionStorage.removeItem('auth_debug_traces');
    console.log('🧹 Auth debug traces cleared');
  }

  // Export traces for debugging
  exportTraces() {
    const exportData = {
      sessionId: this.sessionId,
      exportedAt: new Date().toISOString(),
      traces: this.traces,
      summary: this.getTraceSummary()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auth_debug_${this.sessionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    console.log('📁 Auth debug traces exported');
  }

  // Get trace summary
  getTraceSummary() {
    const summary = {
      totalTraces: this.traces.length,
      operations: {},
      levels: {},
      timeRange: {
        start: this.traces[0]?.timestamp,
        end: this.traces[this.traces.length - 1]?.timestamp
      }
    };
    
    this.traces.forEach(trace => {
      summary.operations[trace.operation] = (summary.operations[trace.operation] || 0) + 1;
      summary.levels[trace.level] = (summary.levels[trace.level] || 0) + 1;
    });
    
    return summary;
  }

  // Log Redux state changes
  logReduxStateChange(action, prevState, nextState) {
    if (!this.isEnabled) return;

    const stateChanges = this.getStateChanges(prevState.auth, nextState.auth);
    
    this.logAuthOperation('state_update', {
      action: {
        type: action.type,
        payload: this.sanitizeData(action.payload || {})
      },
      stateChanges,
      authState: {
        isAuthenticated: nextState.auth.isAuthenticated,
        loading: nextState.auth.loading,
        sessionInitialized: nextState.auth.sessionInitialized,
        hasUser: !!nextState.auth.user,
        hasError: !!nextState.auth.error
      }
    });
  }

  // Get state changes between two states
  getStateChanges(prevState, nextState) {
    const changes = {};
    const keys = new Set([...Object.keys(prevState), ...Object.keys(nextState)]);
    
    keys.forEach(key => {
      if (prevState[key] !== nextState[key]) {
        changes[key] = {
          from: key === 'user' ? (prevState[key] ? 'user_object' : null) : prevState[key],
          to: key === 'user' ? (nextState[key] ? 'user_object' : null) : nextState[key]
        };
      }
    });
    
    return changes;
  }

  // Create debug panel in DOM (for development)
  createDebugPanel() {
    if (!this.isEnabled || document.getElementById('auth-debug-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'auth-debug-panel';
    panel.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      width: 300px;
      max-height: 400px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 10px;
      border-radius: 5px;
      font-family: monospace;
      font-size: 12px;
      z-index: 10000;
      overflow-y: auto;
      display: none;
    `;

    const header = document.createElement('div');
    header.innerHTML = `
      <strong>Auth Debug Panel</strong>
      <button onclick="this.parentElement.parentElement.style.display='none'" style="float: right; background: red; color: white; border: none; padding: 2px 5px; cursor: pointer;">×</button>
      <button onclick="window.authDebugger.clearTraces()" style="float: right; background: orange; color: white; border: none; padding: 2px 5px; cursor: pointer; margin-right: 5px;">Clear</button>
      <button onclick="window.authDebugger.exportTraces()" style="float: right; background: green; color: white; border: none; padding: 2px 5px; cursor: pointer; margin-right: 5px;">Export</button>
    `;

    const content = document.createElement('div');
    content.id = 'auth-debug-content';

    panel.appendChild(header);
    panel.appendChild(content);
    document.body.appendChild(panel);

    // Add keyboard shortcut to toggle panel
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        if (panel.style.display === 'block') {
          this.updateDebugPanel();
        }
      }
    });

    console.log('🔧 Auth debug panel created. Press Ctrl+Shift+A to toggle.');
  }

  // Update debug panel content
  updateDebugPanel() {
    const content = document.getElementById('auth-debug-content');
    if (!content) return;

    const recentTraces = this.getRecentTraces(10);
    const summary = this.getTraceSummary();

    content.innerHTML = `
      <div style="margin: 10px 0;">
        <strong>Summary:</strong><br>
        Total: ${summary.totalTraces} | 
        Errors: ${summary.levels.error || 0} | 
        Session: ${this.sessionId.split('_')[2]}
      </div>
      <div style="margin: 10px 0;">
        <strong>Recent Traces:</strong>
        ${recentTraces.map(trace => `
          <div style="margin: 5px 0; padding: 5px; background: rgba(255,255,255,0.1); border-radius: 3px;">
            <div style="font-weight: bold;">${this.getEmojiForOperation(trace.operation, trace.level)} ${trace.operation}</div>
            <div style="font-size: 10px; color: #ccc;">${new Date(trace.timestamp).toLocaleTimeString()}</div>
          </div>
        `).join('')}
      </div>
    `;
  }
}

// Create global instance
const authDebugger = new AuthDebugger();

// Make available globally for debugging
if (typeof window !== 'undefined') {
  window.authDebugger = authDebugger;
}

export default authDebugger;