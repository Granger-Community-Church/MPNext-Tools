import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ProcedureService } from '@/lib/providers/ministry-platform/services/procedure.service';
import type { MinistryPlatformClient } from '@/lib/providers/ministry-platform/client';
import type { HttpClient } from '@/lib/providers/ministry-platform/utils/http-client';

describe('ProcedureService', () => {
  let service: ProcedureService;
  let mockClient: MinistryPlatformClient;
  let mockHttpClient: HttpClient;

  beforeEach(() => {
    vi.clearAllMocks();

    mockHttpClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      buildUrl: vi.fn(),
      postFormData: vi.fn(),
      putFormData: vi.fn(),
    } as unknown as HttpClient;

    mockClient = {
      ensureValidToken: vi.fn().mockResolvedValue(undefined),
      getHttpClient: vi.fn().mockReturnValue(mockHttpClient),
    } as unknown as MinistryPlatformClient;

    service = new ProcedureService(mockClient);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getProcedures', () => {
    it('should call /procs without search', async () => {
      const procs = [{ Name: 'api_Test' }];
      (mockHttpClient.get as any).mockResolvedValueOnce(procs);

      const result = await service.getProcedures();

      expect(mockClient.ensureValidToken).toHaveBeenCalledTimes(1);
      expect(mockHttpClient.get).toHaveBeenCalledWith('/procs', undefined);
      expect(result).toEqual(procs);
    });

    it('should pass search param', async () => {
      (mockHttpClient.get as any).mockResolvedValueOnce([]);

      await service.getProcedures('api_');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/procs', { $search: 'api_' });
    });

    it('should propagate errors', async () => {
      (mockHttpClient.get as any).mockRejectedValueOnce(new Error('403 Forbidden'));

      await expect(service.getProcedures()).rejects.toThrow('403 Forbidden');
    });
  });

  describe('executeProcedure', () => {
    it('should call get without params', async () => {
      const data = [[{ Contact_ID: 1 }]];
      (mockHttpClient.get as any).mockResolvedValueOnce(data);

      const result = await service.executeProcedure('api_Get_Contacts');

      expect(mockClient.ensureValidToken).toHaveBeenCalledTimes(1);
      expect(mockHttpClient.get).toHaveBeenCalledWith('/procs/api_Get_Contacts', undefined);
      expect(result).toEqual(data);
    });

    it('should pass query params', async () => {
      (mockHttpClient.get as any).mockResolvedValueOnce([[]]);

      await service.executeProcedure('api_Get_Contacts', { '@DomainID': 1 } as any);

      expect(mockHttpClient.get).toHaveBeenCalledWith('/procs/api_Get_Contacts', { '@DomainID': 1 });
    });

    it('should URL-encode procedure name with special chars', async () => {
      (mockHttpClient.get as any).mockResolvedValueOnce([[]]);

      await service.executeProcedure('api_Test Proc');

      const endpoint = (mockHttpClient.get as any).mock.calls[0][0];
      expect(endpoint).toBe('/procs/api_Test%20Proc');
    });

    it('should propagate errors', async () => {
      (mockHttpClient.get as any).mockRejectedValueOnce(new Error('404 Not Found'));

      await expect(service.executeProcedure('api_Missing')).rejects.toThrow('404 Not Found');
    });
  });

  describe('executeProcedureWithBody', () => {
    it('should call post with body parameters', async () => {
      const data = [[{ id: 1 }]];
      (mockHttpClient.post as any).mockResolvedValueOnce(data);

      const result = await service.executeProcedureWithBody('api_Test', { foo: 'bar' });

      expect(mockClient.ensureValidToken).toHaveBeenCalledTimes(1);
      expect(mockHttpClient.post).toHaveBeenCalledWith('/procs/api_Test', { foo: 'bar' });
      expect(result).toEqual(data);
    });

    it('should URL-encode procedure name with special chars', async () => {
      (mockHttpClient.post as any).mockResolvedValueOnce([[]]);

      await service.executeProcedureWithBody('api_Test Proc', {});

      const endpoint = (mockHttpClient.post as any).mock.calls[0][0];
      expect(endpoint).toBe('/procs/api_Test%20Proc');
    });

    it('should propagate errors', async () => {
      (mockHttpClient.post as any).mockRejectedValueOnce(new Error('500 Internal Server Error'));

      await expect(service.executeProcedureWithBody('api_Failing', {})).rejects.toThrow(
        '500 Internal Server Error'
      );
    });
  });

  describe('Token Validation', () => {
    it('should ensure valid token before each operation', async () => {
      (mockHttpClient.get as any).mockResolvedValue([]);
      (mockHttpClient.post as any).mockResolvedValue([]);

      await service.getProcedures();
      await service.executeProcedure('api_X');
      await service.executeProcedureWithBody('api_Y', {});

      expect(mockClient.ensureValidToken).toHaveBeenCalledTimes(3);
    });
  });
});
