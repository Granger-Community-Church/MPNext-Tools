import { describe, it, expect } from 'vitest';
import { validateGuid, validatePositiveInt, validateColumnName, escapeFilterString } from './validation';

describe('validation', () => {
  describe('validateGuid', () => {
    it('accepts a valid GUID', () => {
      const guid = '550e8400-e29b-41d4-a716-446655440000';
      expect(validateGuid(guid)).toBe(guid);
    });

    it('accepts uppercase GUID', () => {
      const guid = '550E8400-E29B-41D4-A716-446655440000';
      expect(validateGuid(guid)).toBe(guid);
    });

    it('throws on malformed GUID', () => {
      expect(() => validateGuid('not-a-guid')).toThrow('Invalid GUID format');
    });

    it('throws on empty string', () => {
      expect(() => validateGuid('')).toThrow('Invalid GUID format');
    });

    it('throws on SQL injection attempt', () => {
      expect(() => validateGuid("'; DROP TABLE--")).toThrow('Invalid GUID format');
    });
  });

  describe('validatePositiveInt', () => {
    it('accepts positive integer', () => {
      expect(validatePositiveInt(42)).toBe(42);
    });

    it('throws on zero', () => {
      expect(() => validatePositiveInt(0)).toThrow('Expected positive integer');
    });

    it('throws on negative number', () => {
      expect(() => validatePositiveInt(-5)).toThrow('Expected positive integer');
    });

    it('throws on float', () => {
      expect(() => validatePositiveInt(3.14)).toThrow('Expected positive integer');
    });

    it('throws on NaN', () => {
      expect(() => validatePositiveInt(NaN)).toThrow('Expected positive integer');
    });
  });

  describe('validateColumnName', () => {
    it('accepts valid column names', () => {
      expect(validateColumnName('Contact_ID')).toBe('Contact_ID');
      expect(validateColumnName('_private')).toBe('_private');
      expect(validateColumnName('name123')).toBe('name123');
    });

    it('throws on names starting with digit', () => {
      expect(() => validateColumnName('1column')).toThrow('Invalid column name');
    });

    it('throws on names with special characters', () => {
      expect(() => validateColumnName('col-name')).toThrow('Invalid column name');
    });

    it('throws on SQL injection attempt', () => {
      expect(() => validateColumnName("' OR 1=1--")).toThrow('Invalid column name');
    });
  });

  describe('escapeFilterString', () => {
    it('escapes single quotes', () => {
      expect(escapeFilterString("O'Brien")).toBe("O''Brien");
    });

    it('escapes percent signs', () => {
      expect(escapeFilterString('50%')).toBe('50[%]');
    });

    it('escapes underscores', () => {
      expect(escapeFilterString('my_field')).toBe('my[_]field');
    });

    it('escapes all special characters together', () => {
      expect(escapeFilterString("O'Brien_50%")).toBe("O''Brien[_]50[%]");
    });

    it('returns empty string unchanged', () => {
      expect(escapeFilterString('')).toBe('');
    });
  });
});
