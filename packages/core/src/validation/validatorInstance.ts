/**
 * Validator Instance
 * 
 * Wrapper for content validation that gets exposed via editor ref.
 */

import type { ContentValidator, ValidationOptions, ValidationResult } from '../types/index';
import { validateContent, isValidContent, getValidationIssues } from './validator';

/**
 * Create a validator instance for the editor ref
 */
export function createValidator(): ContentValidator {
  return {
    validate: (content: any, options?: ValidationOptions): ValidationResult => {
      return validateContent(content, options);
    },

    isValid: (content: any): boolean => {
      return isValidContent(content);
    },

    getIssues: (content: any) => {
      return getValidationIssues(content);
    }
  };
}

