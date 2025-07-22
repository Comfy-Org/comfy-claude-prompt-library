# Firebase Auth Offline Patterns

## Overview

Firebase Auth in ComfyUI makes eager network requests that can block offline usage or fail in regions with Firebase access restrictions (e.g., China). This document outlines the specific behaviors and proven solutions.

## Firebase Auth Request Triggers

### 1. App Initialization
- **Location**: `firebaseAuthStore.ts:82` in `onAuthStateChanged` listener
- **Trigger**: Firebase finds stored auth data with key `firebase:authUser:[PROJECT_ID]:[DEFAULT]`
- **Behavior**: Attempts to validate/refresh token in background
- **Storage**: Uses `browserLocalPersistence` (localStorage/IndexedDB)

### 2. Queue Prompt Operations
- **Location**: `app.ts:1242-1243` calls `getIdToken()`
- **Trigger**: Every prompt queue operation
- **Behavior**: Attempts to refresh tokens older than 1 hour
- **Impact**: Blocks graph execution when offline

## Key Firebase Behaviors

1. **Token Expiry**: Firebase ID tokens expire after exactly 1 hour
2. **Retry Logic**: Uses exponential backoff with no maximum retry limit
3. **Persistence**: localStorage is NOT cleared on network failures
4. **Offline State**: User remains "logged in" in UI even with expired tokens

## Solution Patterns

### 1. Graceful Error Handling (Simplest)
```typescript
const getIdToken = async (): Promise<string | null> => {
  if (currentUser.value) {
    try {
      return await currentUser.value.getIdToken()
    } catch (error) {
      if (error.code === 'auth/network-request-failed') {
        return null; // Works for offline and firewall blocks
      }
      throw error
    }
  }
  return null
}
```

### 2. Lazy Token Validation
```typescript
// Skip immediate validation on auth state change
onAuthStateChanged(auth, (user) => {
  currentUser.value = user
  isInitialized.value = true
  // Don't validate token here
})

// Only attempt token refresh when needed
const comfyOrgAuthToken = await useFirebaseAuthStore().getIdToken()
  .catch(() => undefined);
```

### 3. Circuit Breaker Pattern
Prevents repeated failures after threshold:
```typescript
class AuthCircuitBreaker {
  private failures = 0;
  private lastFailure = 0;
  private readonly threshold = 3;
  private readonly timeout = 60000; // 1 minute

  async getToken(): Promise<string | null> {
    // Circuit is "open" - skip attempts
    if (this.failures >= this.threshold && 
        Date.now() - this.lastFailure < this.timeout) {
      return null;
    }
    
    try {
      const token = await getIdToken();
      this.failures = 0; // Reset on success
      return token;
    } catch (error) {
      this.failures++;
      this.lastFailure = Date.now();
      return null;
    }
  }
}
```

### 4. Service Worker Intercept
Fast-fail Firebase requests at network layer:
```javascript
// In service worker
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  const firebaseDomains = [
    'googleapis.com',
    'firebaseapp.com', 
    'firebaseio.com'
  ];
  
  if (firebaseDomains.some(domain => url.hostname.includes(domain))) {
    event.respondWith(
      Promise.race([
        fetch(event.request),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 3000)
        )
      ]).catch(() => 
        new Response(null, { status: 503, statusText: 'Service Unavailable' })
      )
    );
  }
});
```

### 5. Offline-First Auth Store
Wrapper with availability checking:
```typescript
export const useOfflineAuthStore = () => {
  const authStore = useFirebaseAuthStore();
  const firebaseAvailable = ref(true);
  const lastValidToken = ref<string | null>(null);
  
  const checkFirebaseAvailability = async () => {
    try {
      await fetch('https://www.googleapis.com/identitytoolkit/v3/relyingparty', {
        method: 'HEAD',
        mode: 'no-cors',
        signal: AbortSignal.timeout(2000)
      });
      firebaseAvailable.value = true;
    } catch {
      firebaseAvailable.value = false;
    }
  };
  
  return {
    ...authStore,
    getIdToken: async () => {
      if (!firebaseAvailable.value) {
        return lastValidToken.value; // Use cached token
      }
      
      try {
        const token = await authStore.getIdToken();
        lastValidToken.value = token; // Cache for offline
        return token;
      } catch (error) {
        firebaseAvailable.value = false;
        return lastValidToken.value;
      }
    }
  };
}
```

## Common Pitfalls

1. **Don't rely on `navigator.onLine`**: It doesn't detect firewall blocks
2. **Avoid infinite retry loops**: Firebase's exponential backoff can cause performance issues
3. **Cache tokens carefully**: Expired tokens may still work for some operations
4. **Handle both scenarios**: Offline network AND firewall restrictions

## Testing Offline Scenarios

1. **True offline**: Disconnect network after sign-in
2. **Firewall simulation**: Block Firebase domains in browser DevTools
3. **Token expiry**: Wait 1+ hours before testing
4. **Cold start**: Close browser completely before testing

## Related Issues

- GitHub Issue #4468: Firebase Auth network requests blocking offline usage
- Firebase Auth persistence documentation: https://firebase.google.com/docs/auth/web/auth-state-persistence

## Implementation Status

As of v1.24.1, ComfyUI does not implement offline handling for Firebase Auth. The proposed solutions above are recommendations based on the discovered behaviors.