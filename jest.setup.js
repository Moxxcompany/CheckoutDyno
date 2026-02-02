import '@testing-library/jest-dom';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    query: {},
    pathname: '/',
    asPath: '/',
  }),
}));

// Mock next-i18next
jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      language: 'en',
      changeLanguage: jest.fn(),
    },
  }),
  serverSideTranslations: jest.fn(() => Promise.resolve({})),
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      language: 'en',
      changeLanguage: jest.fn(),
    },
  }),
}));

// Mock window.location - use delete pattern for JSDOM
const mockLocation = {
  replace: jest.fn(),
  assign: jest.fn(),
  href: '',
  origin: 'http://localhost:3000',
  pathname: '/',
  search: '',
  hash: '',
  reload: jest.fn(),
};

// Store original and set mock
const originalLocation = window.location;
beforeAll(() => {
  // @ts-ignore - JSDOM quirk
  delete window.location;
  window.location = mockLocation;
});

afterAll(() => {
  window.location = originalLocation;
});

// Reset location mocks between tests
beforeEach(() => {
  mockLocation.href = '';
  mockLocation.replace.mockClear();
  mockLocation.assign.mockClear();
});

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'sessionStorage', { 
  value: sessionStorageMock,
  configurable: true 
});

// Mock clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn().mockResolvedValue(undefined),
    readText: jest.fn().mockResolvedValue(''),
  },
  configurable: true,
  writable: true,
});

// Suppress console errors in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    const message = typeof args[0] === 'string' ? args[0] : '';
    if (
      message.includes('Warning: ReactDOM.render is no longer supported') ||
      message.includes('Not implemented: navigation') ||
      message.includes('Error: Not implemented')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
