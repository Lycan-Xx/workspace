/**
 * Development-friendly notification system
 * Shows detailed error messages and debugging information in development mode
 */

class DevNotificationManager {
  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'development';
    this.notifications = [];
    this.maxNotifications = 5;
    this.container = null;
    
    if (this.isEnabled) {
      this.createNotificationContainer();
      this.setupEventListeners();
    }
  }

  createNotificationContainer() {
    if (document.getElementById('dev-notifications')) return;

    this.container = document.createElement('div');
    this.container.id = 'dev-notifications';
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 10001;
      max-width: 400px;
      pointer-events: none;
    `;

    document.body.appendChild(this.container);
  }

  setupEventListeners() {
    // Listen for custom notification events
    window.addEventListener('show-notification', (event) => {
      this.show(event.detail);
    });

    // Listen for auth debug events
    window.addEventListener('auth-debug', (event) => {
      this.showAuthDebug(event.detail);
    });
  }

  show(options = {}) {
    if (!this.isEnabled || !this.container) return;

    const {
      type = 'info',
      title = 'Development Notice',
      message = '',
      duration = 5000,
      details = null,
      actions = []
    } = options;

    const notification = this.createNotificationElement({
      type,
      title,
      message,
      details,
      actions
    });

    // Add to container
    this.container.appendChild(notification);
    this.notifications.push(notification);

    // Remove old notifications if too many
    while (this.notifications.length > this.maxNotifications) {
      const oldNotification = this.notifications.shift();
      if (oldNotification && oldNotification.parentNode) {
        oldNotification.parentNode.removeChild(oldNotification);
      }
    }

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.remove(notification);
      }, duration);
    }

    // Animate in
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)';
      notification.style.opacity = '1';
    });
  }

  createNotificationElement({ type, title, message, details, actions }) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      background: ${this.getBackgroundColor(type)};
      border: 1px solid ${this.getBorderColor(type)};
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateX(-100%);
      opacity: 0;
      transition: all 0.3s ease;
      pointer-events: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.4;
    `;

    const icon = this.getIcon(type);
    const titleColor = this.getTitleColor(type);
    const messageColor = this.getMessageColor(type);

    let html = `
      <div style="display: flex; align-items: flex-start; gap: 8px;">
        <div style="font-size: 16px; margin-top: 2px;">${icon}</div>
        <div style="flex: 1; min-width: 0;">
          <div style="font-weight: 600; color: ${titleColor}; margin-bottom: 4px;">
            ${title}
          </div>
          ${message ? `<div style="color: ${messageColor}; margin-bottom: 8px;">${message}</div>` : ''}
    `;

    // Add details if provided
    if (details) {
      html += `
        <details style="margin-top: 8px;">
          <summary style="cursor: pointer; color: ${titleColor}; font-size: 12px; margin-bottom: 4px;">
            Show Details
          </summary>
          <pre style="background: rgba(0,0,0,0.1); padding: 8px; border-radius: 4px; font-size: 11px; overflow-x: auto; margin: 4px 0 0 0; white-space: pre-wrap;">${JSON.stringify(details, null, 2)}</pre>
        </details>
      `;
    }

    // Add actions if provided
    if (actions.length > 0) {
      html += `<div style="margin-top: 8px; display: flex; gap: 8px;">`;
      actions.forEach(action => {
        html += `
          <button 
            onclick="${action.onClick}" 
            style="
              background: ${this.getBorderColor(type)}; 
              color: white; 
              border: none; 
              padding: 4px 8px; 
              border-radius: 4px; 
              font-size: 12px; 
              cursor: pointer;
            "
          >
            ${action.label}
          </button>
        `;
      });
      html += `</div>`;
    }

    html += `
        </div>
        <button 
          onclick="this.parentElement.parentElement.remove()" 
          style="
            background: none; 
            border: none; 
            font-size: 18px; 
            cursor: pointer; 
            color: ${messageColor}; 
            padding: 0; 
            margin-left: 8px;
          "
        >
          ×
        </button>
      </div>
    `;

    notification.innerHTML = html;
    return notification;
  }

  remove(notification) {
    if (!notification || !notification.parentNode) return;

    notification.style.transform = 'translateX(-100%)';
    notification.style.opacity = '0';

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
      const index = this.notifications.indexOf(notification);
      if (index > -1) {
        this.notifications.splice(index, 1);
      }
    }, 300);
  }

  showAuthDebug({ operation, data, level = 'info' }) {
    const title = `Auth Debug: ${operation}`;
    const message = this.formatAuthMessage(operation, data);
    
    this.show({
      type: level,
      title,
      message,
      details: data,
      duration: level === 'error' ? 10000 : 5000
    });
  }

  formatAuthMessage(operation, data) {
    switch (operation) {
      case 'login':
        return data.error ? `Login failed: ${data.error}` : `Login successful for ${data.email}`;
      case 'signup':
        return data.error ? `Signup failed: ${data.error}` : `Signup successful for ${data.email}`;
      case 'logout':
        return 'User logged out successfully';
      case 'session_init':
        return data.sessionFound ? 'Session restored from storage' : 'No existing session found';
      case 'session_restore':
        return `Session restored for ${data.email}`;
      case 'token_refresh':
        return data.result === 'success' ? 'Token refreshed successfully' : 'Token refresh failed';
      case 'session_expire':
        return 'Session expired - user logged out';
      default:
        return `Auth operation: ${operation}`;
    }
  }

  getBackgroundColor(type) {
    const colors = {
      info: '#e3f2fd',
      success: '#e8f5e8',
      warn: '#fff3e0',
      error: '#ffebee'
    };
    return colors[type] || colors.info;
  }

  getBorderColor(type) {
    const colors = {
      info: '#2196f3',
      success: '#4caf50',
      warn: '#ff9800',
      error: '#f44336'
    };
    return colors[type] || colors.info;
  }

  getTitleColor(type) {
    const colors = {
      info: '#1565c0',
      success: '#2e7d32',
      warn: '#ef6c00',
      error: '#c62828'
    };
    return colors[type] || colors.info;
  }

  getMessageColor(type) {
    const colors = {
      info: '#424242',
      success: '#424242',
      warn: '#424242',
      error: '#424242'
    };
    return colors[type] || colors.info;
  }

  getIcon(type) {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warn: '⚠️',
      error: '❌'
    };
    return icons[type] || icons.info;
  }

  // Convenience methods
  info(message, options = {}) {
    this.show({ ...options, type: 'info', message });
  }

  success(message, options = {}) {
    this.show({ ...options, type: 'success', message });
  }

  warn(message, options = {}) {
    this.show({ ...options, type: 'warn', message });
  }

  error(message, options = {}) {
    this.show({ ...options, type: 'error', message });
  }

  // Clear all notifications
  clear() {
    this.notifications.forEach(notification => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    });
    this.notifications = [];
  }
}

// Create global instance
const devNotifications = new DevNotificationManager();

// Make available globally for debugging
if (typeof window !== 'undefined') {
  window.devNotifications = devNotifications;
}

export default devNotifications;