import { describe, it, expect } from 'vitest';
import { imbBarcodeToBmp, postnetBarcodeToBmp } from './barcode-image';

describe('imbBarcodeToBmp', () => {
  it('returns a BMP buffer with the correct signature', () => {
    const buf = imbBarcodeToBmp('TDAFTDAFTDAFTDAFTDAFTDAFTDAFTDAFTDAFTDAFTDAFTDAFTDAFTDAFTDAFTDAF', 200, 30);
    expect(Buffer.isBuffer(buf)).toBe(true);
    expect(buf.slice(0, 2).toString()).toBe('BM');
  });

  it('skips invalid bar state characters', () => {
    const buf = imbBarcodeToBmp('TDAF?XYZ', 100, 20);
    expect(buf.slice(0, 2).toString()).toBe('BM');
  });

  it('handles default dimensions', () => {
    const buf = imbBarcodeToBmp('T');
    expect(buf.slice(0, 2).toString()).toBe('BM');
  });
});

describe('postnetBarcodeToBmp', () => {
  it('returns a BMP buffer for valid JSON bar input', () => {
    const json = JSON.stringify(['tall', 'short', 'tall', 'short']);
    const buf = postnetBarcodeToBmp(json, 200, 24);
    expect(Buffer.isBuffer(buf)).toBe(true);
    expect(buf.slice(0, 2).toString()).toBe('BM');
  });

  it('returns a 1x1 fallback BMP on invalid JSON', () => {
    const buf = postnetBarcodeToBmp('not-json');
    expect(buf.slice(0, 2).toString()).toBe('BM');
    expect(buf.length).toBeGreaterThan(0);
  });

  it('handles default dimensions with all short bars', () => {
    const json = JSON.stringify(['short', 'short']);
    const buf = postnetBarcodeToBmp(json);
    expect(buf.slice(0, 2).toString()).toBe('BM');
  });
});
