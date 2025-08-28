import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleSessionExpiration, validateSession, updateSessionCheck } from '../components/EvaultPlatform/store/authSlice';
import devNotifications from '../utils/devNotifications';

/**
 * Custom hook for managing user sessions
 * Handles session expiration, validation, and cleanup
 */
export const useSessionManager = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, sessionInitialized, lastSessionCheck } = useSelector(state => state.auth);

    // Handle session expiration events
    const handleSessionExpired = useCallback(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log('🔔 Session expiration event received');
            devNotifications.showAuthDebug({
                operation: 'session_expire',
                data: { reason: 'automatic_expiration' },
                level: 'warn'
            });
        }
        dispatch(handleSessionExpiration());
    }, [dispatch]);

    // Validate session periodically
    const validateCurrentSession = useCallback(async () => {
        if (!isAuthenticated || !sessionInitialized) return;

        try {
            await dispatch(validateSession()).unwrap();
            dispatch(updateSessionCheck());
        } catch (error) {
            console.error('❌ Session validation failed:', error);
            // Session validation failure is handled in the thunk
        }
    }, [dispatch, isAuthenticated, sessionInitialized]);

    // Set up session expiration event listener
    useEffect(() => {
        const handleSessionExpiredEvent = () => {
            handleSessionExpired();
        };

        // Listen for session expiration events from API service
        window.addEventListener('session-expired', handleSessionExpiredEvent);

        return () => {
            window.removeEventListener('session-expired', handleSessionExpiredEvent);
        };
    }, [handleSessionExpired]);

    // Set up periodic session validation
    useEffect(() => {
        if (!isAuthenticated || !sessionInitialized) return;

        // Validate session every 5 minutes
        const validationInterval = setInterval(() => {
            validateCurrentSession();
        }, 5 * 60 * 1000); // 5 minutes

        // Initial validation if it's been more than 5 minutes since last check
        const now = Date.now();
        const fiveMinutesAgo = now - (5 * 60 * 1000);

        if (!lastSessionCheck || lastSessionCheck < fiveMinutesAgo) {
            validateCurrentSession();
        }

        return () => {
            clearInterval(validationInterval);
        };
    }, [isAuthenticated, sessionInitialized, lastSessionCheck, validateCurrentSession]);

    // Handle page visibility changes - validate session when page becomes visible
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && isAuthenticated) {
                // Validate session when user returns to the page
                validateCurrentSession();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isAuthenticated, validateCurrentSession]);

    // Handle beforeunload - cleanup session monitoring
    useEffect(() => {
        const handleBeforeUnload = () => {
            // Update last session check timestamp
            if (isAuthenticated) {
                dispatch(updateSessionCheck());
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [dispatch, isAuthenticated]);

    return {
        validateSession: validateCurrentSession,
        isSessionValid: isAuthenticated && sessionInitialized
    };
};

export default useSessionManager;