import authReducer, { login, logout, clearError, updateUsers } from '../authSlice';
import { mockUsers } from '@/constants/mockUsers';
import { AuthState, User } from '../types';

describe('authSlice', () => {
  const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    users: mockUsers,
  };

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should have mock users loaded', () => {
      const state = authReducer(undefined, { type: 'unknown' });
      expect(state.users).toHaveLength(4);
      expect(state.users[0].username).toBe('luke');
    });
  });

  describe('login action', () => {
    it('should handle login', () => {
      const user: User = {
        id: '1',
        username: 'luke',
        email: 'luke@starwars.com',
        password: 'skywalker',
      };

      const actual = authReducer(initialState, login(user));

      expect(actual.user).toEqual(user);
      expect(actual.isAuthenticated).toBe(true);
      expect(actual.error).toBeNull();
    });

    it('should clear error on successful login', () => {
      const stateWithError: AuthState = {
        ...initialState,
        error: 'Previous error',
      };

      const user: User = {
        id: '1',
        username: 'luke',
        email: 'luke@starwars.com',
        password: 'skywalker',
      };

      const actual = authReducer(stateWithError, login(user));

      expect(actual.error).toBeNull();
      expect(actual.isAuthenticated).toBe(true);
    });
  });

  describe('logout action', () => {
    it('should handle logout', () => {
      const loggedInState: AuthState = {
        ...initialState,
        user: {
          id: '1',
          username: 'luke',
          email: 'luke@starwars.com',
          password: 'skywalker',
        },
        isAuthenticated: true,
      };

      const actual = authReducer(loggedInState, logout());

      expect(actual.user).toBeNull();
      expect(actual.isAuthenticated).toBe(false);
      expect(actual.error).toBeNull();
    });

    it('should clear error on logout', () => {
      const stateWithError: AuthState = {
        ...initialState,
        user: {
          id: '1',
          username: 'luke',
          email: 'luke@starwars.com',
          password: 'skywalker',
        },
        isAuthenticated: true,
        error: 'Some error',
      };

      const actual = authReducer(stateWithError, logout());

      expect(actual.error).toBeNull();
    });
  });

  describe('clearError action', () => {
    it('should clear error', () => {
      const stateWithError: AuthState = {
        ...initialState,
        error: 'Some error message',
      };

      const actual = authReducer(stateWithError, clearError());

      expect(actual.error).toBeNull();
      expect(actual.user).toBe(stateWithError.user);
      expect(actual.isAuthenticated).toBe(stateWithError.isAuthenticated);
    });

    it('should not affect other state when clearing error', () => {
      const stateWithUserAndError: AuthState = {
        ...initialState,
        user: {
          id: '1',
          username: 'luke',
          email: 'luke@starwars.com',
          password: 'skywalker',
        },
        isAuthenticated: true,
        error: 'Some error',
      };

      const actual = authReducer(stateWithUserAndError, clearError());

      expect(actual.error).toBeNull();
      expect(actual.user).toEqual(stateWithUserAndError.user);
      expect(actual.isAuthenticated).toBe(true);
    });
  });

  describe('updateUsers action', () => {
    it('should add new user to users array', () => {
      const newUser: User = {
        id: '5',
        username: 'newuser',
        email: 'newuser@test.com',
        password: 'password123',
      };

      const actual = authReducer(initialState, updateUsers(newUser));

      expect(actual.users).toHaveLength(5);
      expect(actual.users[4]).toEqual(newUser);
    });

    it('should not affect other state when adding user', () => {
      const stateWithUser: AuthState = {
        ...initialState,
        user: {
          id: '1',
          username: 'luke',
          email: 'luke@starwars.com',
          password: 'skywalker',
        },
        isAuthenticated: true,
      };

      const newUser: User = {
        id: '5',
        username: 'newuser',
        email: 'newuser@test.com',
        password: 'password123',
      };

      const actual = authReducer(stateWithUser, updateUsers(newUser));

      expect(actual.users).toHaveLength(5);
      expect(actual.user).toEqual(stateWithUser.user);
      expect(actual.isAuthenticated).toBe(true);
    });

    it('should preserve existing users when adding new user', () => {
      const newUser: User = {
        id: '5',
        username: 'newuser',
        email: 'newuser@test.com',
        password: 'password123',
      };

      const actual = authReducer(initialState, updateUsers(newUser));

      // Check that all original users are still there
      expect(actual.users[0].username).toBe('luke');
      expect(actual.users[1].username).toBe('leia');
      expect(actual.users[2].username).toBe('han');
      expect(actual.users[3].username).toBe('admin');
      expect(actual.users[4]).toEqual(newUser);
    });
  });

  describe('edge cases', () => {
    it('should handle multiple logins', () => {
      const user1: User = {
        id: '1',
        username: 'luke',
        email: 'luke@starwars.com',
        password: 'skywalker',
      };

      const user2: User = {
        id: '2',
        username: 'leia',
        email: 'leia@starwars.com',
        password: 'princess',
      };

      let state = authReducer(initialState, login(user1));
      expect(state.user).toEqual(user1);

      state = authReducer(state, login(user2));
      expect(state.user).toEqual(user2);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should handle logout when not logged in', () => {
      const actual = authReducer(initialState, logout());

      expect(actual.user).toBeNull();
      expect(actual.isAuthenticated).toBe(false);
      expect(actual.error).toBeNull();
    });

    it('should handle clearError when no error exists', () => {
      const actual = authReducer(initialState, clearError());

      expect(actual.error).toBeNull();
      expect(actual).toEqual(initialState);
    });
  });

  describe('state immutability', () => {
    it('should not mutate original state on login', () => {
      const user: User = {
        id: '1',
        username: 'luke',
        email: 'luke@starwars.com',
        password: 'skywalker',
      };

      const originalState = { ...initialState };
      authReducer(initialState, login(user));

      expect(initialState).toEqual(originalState);
    });

    it('should not mutate original state on updateUsers', () => {
      const newUser: User = {
        id: '5',
        username: 'newuser',
        email: 'newuser@test.com',
        password: 'password123',
      };

      const originalState = { ...initialState };
      const originalUsersLength = initialState.users.length;
      
      authReducer(initialState, updateUsers(newUser));

      expect(initialState).toEqual(originalState);
      expect(initialState.users).toHaveLength(originalUsersLength);
    });
  });
});