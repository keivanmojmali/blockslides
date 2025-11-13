/**
 * Content Validation
 *
 * Comprehensive validation with detailed errors, auto-fix, and multiple modes.
 * Exports both new enhanced validation and backward-compatible legacy functions.
 */

// Export enhanced validation (new API)
export {
  validateContent,
  isValidContent,
  getValidationIssues,
  safeValidateContent,
  ValidationError
} from './validator';

// Re-export for convenience
export { createValidator } from './validatorInstance';
