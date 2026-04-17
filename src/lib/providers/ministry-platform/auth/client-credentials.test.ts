import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getClientCredentialsToken } from './client-credentials';

describe('getClientCredentialsToken', () => {
  const originalFetch = global.fetch;
  const originalEnv = { ...process.env };
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
    global.fetch = mockFetch as unknown as typeof fetch;
    process.env.MINISTRY_PLATFORM_BASE_URL = 'https://api.example.com';
    process.env.MINISTRY_PLATFORM_CLIENT_ID = 'test-client-id';
    process.env.MINISTRY_PLATFORM_CLIENT_SECRET = 'test-secret';
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  // Successful token fetch
  it('should fetch token with correct URL, method, headers, and body', async () => {
    const tokenResponse = { access_token: 'abc', expires_in: 3600 };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => tokenResponse,
    });

    const result = await getClientCredentialsToken();

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('https://api.example.com/oauth/connect/token');
    expect(init.method).toBe('POST');
    expect(init.headers).toEqual({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    expect(init.body).toContain('grant_type=client_credentials');
    expect(init.body).toContain('client_id=test-client-id');
    expect(init.body).toContain('client_secret=test-secret');
    expect(init.body).toContain('scope=');
    expect(result).toEqual(tokenResponse);
  });

  // Non-ok response throws
  it('should throw error when response is not ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Unauthorized',
      json: async () => ({}),
    });

    await expect(getClientCredentialsToken()).rejects.toThrow(
      'Failed to get client credentials token: Unauthorized'
    );
  });

  // Network failure propagates
  it('should propagate network errors from fetch', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(getClientCredentialsToken()).rejects.toThrow('Network error');
  });

  // Body uses URLSearchParams format
  it('should format body as URLSearchParams', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'x' }),
    });

    await getClientCredentialsToken();

    const [, init] = mockFetch.mock.calls[0];
    const body = init.body as string;
    const parsed = new URLSearchParams(body);
    expect(parsed.get('grant_type')).toBe('client_credentials');
    expect(parsed.get('client_id')).toBe('test-client-id');
    expect(parsed.get('client_secret')).toBe('test-secret');
    expect(parsed.get('scope')).toBe(
      'http://www.thinkministry.com/dataplatform/scopes/all'
    );
  });

  // Uses MINISTRY_PLATFORM_BASE_URL env var
  it('should use MINISTRY_PLATFORM_BASE_URL env var for URL construction', async () => {
    process.env.MINISTRY_PLATFORM_BASE_URL = 'https://custom-domain.org';
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'y' }),
    });

    await getClientCredentialsToken();

    const [url] = mockFetch.mock.calls[0];
    expect(url).toBe('https://custom-domain.org/oauth/connect/token');
  });
});
