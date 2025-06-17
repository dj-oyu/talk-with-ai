import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/store/authStore';

const baseState = useAuthStore.getState();

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      ...baseState,
      user: null,
      isAuthenticated: false,
      token: null,
    });
  });

  it('login sets user and token', async () => {
    await useAuthStore.getState().login({ email: 'a@example.com', password: 'x' });
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe('dummy-token');
    expect(state.user?.email).toBe('a@example.com');
  });

  it('logout clears authentication', () => {
    useAuthStore.setState({
      user: { id: '1', email: 'a', name: 'A' },
      isAuthenticated: true,
      token: 't',
    });
    useAuthStore.getState().logout();
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
  });

  it('register sets user data', async () => {
    await useAuthStore.getState().register({ email: 'b@example.com', password: 'p', name: 'B' });
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.name).toBe('B');
  });
});
