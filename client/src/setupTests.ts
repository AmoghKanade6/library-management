// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Add TextEncoder/TextDecoder for Auth0 SDK
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Mock Auth0 React
jest.mock('@auth0/auth0-react', () => ({
  Auth0Provider: ({ children }: any) => children,
  useAuth0: () => ({
    isLoading: false,
    isAuthenticated: false,
    user: null,
    loginWithRedirect: jest.fn(),
    logout: jest.fn(),
    getAccessTokenSilently: jest.fn(),
  }),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

