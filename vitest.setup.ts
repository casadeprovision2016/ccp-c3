import "@testing-library/jest-dom/vitest";

// Ensure JWT_SECRET is available in the test environment for modules that read it at runtime
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-for-testing'
