/**
 * Jest setup file
 * Runs before all tests
 */

// Suppress console warnings in tests (optional)
global.console = {
  ...console,
  // Uncomment to suppress warnings during tests
  // warn: jest.fn(),
};

