/**
 * Enhanced Content Validation
 * 
 * Comprehensive validation with detailed error reporting, JSON paths,
 * auto-fix capabilities, and validation modes.
 */

import type {
  ValidationIssue,
  ValidationResult,
  ValidationOptions
} from '../types/index';

/**
 * ValidationError class
 */
export class ValidationError extends Error {
  public issues: ValidationIssue[];
  
  constructor(message: string, issues: ValidationIssue[]) {
    super(message);
    this.name = 'ValidationError';
    this.issues = issues;
  }
}

/**
 * Create a validation issue
 */
function createIssue(
  type: 'error' | 'warning',
  path: string,
  message: string,
  code: string,
  autoFixable: boolean = false,
  expected?: any,
  received?: any
): ValidationIssue {
  return {
    type,
    path,
    message,
    code,
    autoFixable,
    expected,
    received
  };
}

/**
 * Validate basic node structure
 */
function validateNodeStructure(node: any, path: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!node || typeof node !== 'object') {
    issues.push(createIssue(
      'error',
      path,
      'Node must be an object',
      'INVALID_NODE_TYPE',
      false,
      'object',
      typeof node
    ));
    return issues;
  }

  if (!node.type || typeof node.type !== 'string') {
    issues.push(createIssue(
      'error',
      path,
      'Node must have a "type" string property',
      'MISSING_TYPE',
      false,
      'string',
      typeof node.type
    ));
  }

  return issues;
}

/**
 * Validate doc node
 */
function validateDoc(doc: any, path: string = 'root'): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  
  issues.push(...validateNodeStructure(doc, path));

  if (doc.type !== 'doc') {
    issues.push(createIssue(
      'error',
      path,
      `Root node must be type 'doc', got '${doc.type}'`,
      'INVALID_ROOT_TYPE',
      false,
      'doc',
      doc.type
    ));
  }

  if (!Array.isArray(doc.content)) {
    issues.push(createIssue(
      'error',
      `${path}.content`,
      'Doc must have content array',
      'MISSING_CONTENT',
      true
    ));
    return issues; // Can't continue without content
  }

  if (doc.content.length === 0) {
    issues.push(createIssue(
      'error',
      `${path}.content`,
      'Doc must have at least one slide',
      'EMPTY_CONTENT',
      true
    ));
  }

  // Validate each slide
  doc.content.forEach((node: any, index: number) => {
    issues.push(...validateSlide(node, `${path}.content[${index}]`));
  });

  return issues;
}

/**
 * Validate slide node
 */
function validateSlide(slide: any, path: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  
  issues.push(...validateNodeStructure(slide, path));

  if (slide.type !== 'slide') {
    issues.push(createIssue(
      'error',
      path,
      `Expected 'slide', got '${slide.type}'`,
      'INVALID_NODE_TYPE',
      false,
      'slide',
      slide.type
    ));
  }

  if (!Array.isArray(slide.content)) {
    issues.push(createIssue(
      'error',
      `${path}.content`,
      'Slide must have content array',
      'MISSING_CONTENT',
      true
    ));
    return issues;
  }

  if (slide.content.length === 0) {
    issues.push(createIssue(
      'error',
      `${path}.content`,
      'Slide must have at least one row',
      'EMPTY_SLIDE',
      true
    ));
  }

  // Validate each content node (can be columnGroup, column, or block)
  slide.content.forEach((node: any, index: number) => {
    if (node.type === 'columnGroup' || node.type === 'row') {
      issues.push(...validateColumnGroup(node, `${path}.content[${index}]`));
    }
    // Other node types are validated elsewhere
  });

  return issues;
}

/**
 * Validate columnGroup node
 */
function validateColumnGroup(columnGroup: any, path: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  
  issues.push(...validateNodeStructure(columnGroup, path));

  if (columnGroup.type !== 'columnGroup' && columnGroup.type !== 'row') {
    issues.push(createIssue(
      'error',
      path,
      `Expected 'columnGroup' or 'row', got '${columnGroup.type}'`,
      'INVALID_NODE_TYPE',
      false,
      'columnGroup',
      columnGroup.type
    ));
  }

  if (!Array.isArray(columnGroup.content)) {
    issues.push(createIssue(
      'error',
      `${path}.content`,
      'ColumnGroup must have content array',
      'MISSING_CONTENT',
      true
    ));
    return issues;
  }

  if (columnGroup.content.length === 0) {
    issues.push(createIssue(
      'error',
      `${path}.content`,
      'ColumnGroup must have at least one column',
      'EMPTY_COLUMN_GROUP',
      true
    ));
  }

  // Validate layout attribute if present
  if (columnGroup.attrs?.layout) {
    const layout = columnGroup.attrs.layout;
    if (typeof layout !== 'string') {
      issues.push(createIssue(
        'warning',
        `${path}.attrs.layout`,
        'Layout should be a string',
        'INVALID_LAYOUT_TYPE',
        false,
        'string',
        typeof layout
      ));
    } else if (!/^[\d]+([-][\d]+)*$/.test(layout)) {
      issues.push(createIssue(
        'warning',
        `${path}.attrs.layout`,
        `Invalid layout format: '${layout}'. Expected format like '2-1' or '1-1-1'`,
        'INVALID_LAYOUT_FORMAT',
        false
      ));
    }
  }

  return issues;
}

/**
 * @deprecated Use validateColumnGroup instead
 */
function validateRow(row: any, path: string): ValidationIssue[] {
  return validateColumnGroup(row, path);
}

/**
 * Helper: Get nested property
 */
function getNestedProperty(obj: any, pathParts: string[]): any {
  let current = obj;
  for (const part of pathParts) {
    if (part === 'root') continue;
    const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);
    if (arrayMatch) {
      current = current[arrayMatch[1]][parseInt(arrayMatch[2])];
    } else {
      current = current[part];
    }
    if (current === undefined) return null;
  }
  return current;
}

/**
 * Helper: Set nested property
 */
function setNestedProperty(obj: any, pathParts: string[], value: any): void {
  let current = obj;
  for (let i = 0; i < pathParts.length - 1; i++) {
    const part = pathParts[i];
    if (part === 'root') continue;
    const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);
    if (arrayMatch) {
      current = current[arrayMatch[1]][parseInt(arrayMatch[2])];
    } else {
      current = current[part];
    }
  }
  const lastPart = pathParts[pathParts.length - 1];
  current[lastPart] = value;
}

/**
 * Auto-fix common issues
 */
function autoFixContent(content: any, issues: ValidationIssue[]): any {
  let fixed = JSON.parse(JSON.stringify(content)); // Deep clone

  issues.forEach(issue => {
    if (!issue.autoFixable) return;

    const pathParts = issue.path.split('.');
    
    try {
      switch (issue.code) {
        case 'MISSING_CONTENT':
          // Add empty content array
          setNestedProperty(fixed, pathParts, []);
          break;
          
        case 'EMPTY_CONTENT':
          // Add default slide
          if (issue.path === 'root.content') {
            fixed.content = [{
              type: 'slide',
              content: [{
                type: 'row',
                content: [{
                  type: 'column',
                  content: [{
                    type: 'paragraph',
                    content: []
                  }]
                }]
              }]
            }];
          }
          break;
          
        case 'EMPTY_SLIDE':
          // Add default row
          const slideRef = getNestedProperty(fixed, pathParts.slice(0, -1));
          if (slideRef) {
            slideRef.content = [{
              type: 'row',
              content: [{
                type: 'column',
                content: [{
                  type: 'paragraph',
                  content: []
                }]
              }]
            }];
          }
          break;
          
        case 'EMPTY_ROW':
          // Add default column
          const rowRef = getNestedProperty(fixed, pathParts.slice(0, -1));
          if (rowRef) {
            rowRef.content = [{
              type: 'column',
              content: [{
                type: 'paragraph',
                content: []
              }]
            }];
          }
          break;
      }
    } catch (e) {
      console.warn(`Failed to auto-fix ${issue.code} at ${issue.path}:`, e);
    }
  });

  return fixed;
}

/**
 * Main validation function
 */
export function validateContent(
  content: any,
  options: ValidationOptions = {}
): ValidationResult {
  const { mode = 'lenient', autoFix = false, throwOnError = false } = options;

  // Collect all issues
  const allIssues = validateDoc(content);
  
  const errors = allIssues.filter(i => i.type === 'error');
  const warnings = allIssues.filter(i => i.type === 'warning');
  
  const valid = errors.length === 0 && (mode === 'strict' ? warnings.length === 0 : true);

  const result: ValidationResult = {
    valid,
    errors,
    warnings
  };

  // Auto-fix if requested
  if (autoFix && !valid) {
    const fixableIssues = allIssues.filter(i => i.autoFixable);
    if (fixableIssues.length > 0) {
      result.fixed = autoFixContent(content, fixableIssues);
    }
  }

  // Throw if requested
  if (throwOnError && !valid) {
    const message = `Validation failed with ${errors.length} error(s) and ${warnings.length} warning(s)`;
    throw new ValidationError(message, allIssues);
  }

  return result;
}

/**
 * Quick validation check (returns boolean only)
 */
export function isValidContent(content: any): boolean {
  const result = validateContent(content, { mode: 'lenient' });
  return result.valid;
}

/**
 * Get all issues without full result
 */
export function getValidationIssues(content: any): ValidationIssue[] {
  const result = validateContent(content, { mode: 'lenient' });
  return [...result.errors, ...result.warnings];
}

/**
 * Safe validation (doesn't throw)
 */
export function safeValidateContent(content: any): ValidationResult {
  return validateContent(content, { mode: 'lenient', throwOnError: false });
}

