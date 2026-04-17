import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('logger', () => {
  const originalEnv = process.env.NODE_ENV;
  let logSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.resetModules();
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('debug logs to console when NODE_ENV is not production', async () => {
    process.env.NODE_ENV = 'development';
    const { logger } = await import('./logger');
    logger.debug('message', { foo: 'bar' });
    expect(logSpy).toHaveBeenCalledWith('[MP]', 'message', { foo: 'bar' });
  });

  it('debug is a no-op when NODE_ENV=production', async () => {
    process.env.NODE_ENV = 'production';
    const { logger } = await import('./logger');
    logger.debug('should-be-silenced');
    expect(logSpy).not.toHaveBeenCalled();
  });

  it('error always logs regardless of environment', async () => {
    process.env.NODE_ENV = 'production';
    const { logger } = await import('./logger');
    logger.error('boom', new Error('oops'));
    expect(errorSpy).toHaveBeenCalledWith('[MP]', 'boom', expect.any(Error));
  });
});
