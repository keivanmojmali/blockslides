/**
 * Index Exports Tests
 * 
 * Tests for validation module exports
 */

import * as ValidationIndex from '../index';

describe('Validation Index Exports', () => {
  it('should export validateContent', () => {
    expect(ValidationIndex.validateContent).toBeDefined();
    expect(typeof ValidationIndex.validateContent).toBe('function');
  });

  it('should export isValidContent', () => {
    expect(ValidationIndex.isValidContent).toBeDefined();
    expect(typeof ValidationIndex.isValidContent).toBe('function');
  });

  it('should export getValidationIssues', () => {
    expect(ValidationIndex.getValidationIssues).toBeDefined();
    expect(typeof ValidationIndex.getValidationIssues).toBe('function');
  });

  it('should export safeValidateContent', () => {
    expect(ValidationIndex.safeValidateContent).toBeDefined();
    expect(typeof ValidationIndex.safeValidateContent).toBe('function');
  });

  it('should export ValidationError', () => {
    expect(ValidationIndex.ValidationError).toBeDefined();
    expect(typeof ValidationIndex.ValidationError).toBe('function');
  });

  it('should export createValidator', () => {
    expect(ValidationIndex.createValidator).toBeDefined();
    expect(typeof ValidationIndex.createValidator).toBe('function');
  });

  it('should have all exports working correctly', () => {
    const validDoc = {
      type: 'doc',
      content: [{
        type: 'slide',
        content: [{
          type: 'row',
          content: [{ type: 'column', content: [] }]
        }]
      }]
    };

    // Test that exported functions work
    const result = ValidationIndex.validateContent(validDoc);
    expect(result.valid).toBe(true);

    const isValid = ValidationIndex.isValidContent(validDoc);
    expect(isValid).toBe(true);

    const issues = ValidationIndex.getValidationIssues(validDoc);
    expect(issues).toHaveLength(0);

    const safeResult = ValidationIndex.safeValidateContent(validDoc);
    expect(safeResult.valid).toBe(true);

    const validator = ValidationIndex.createValidator();
    expect(validator).toBeDefined();
  });
});

