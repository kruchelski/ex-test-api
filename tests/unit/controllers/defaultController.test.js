import { jest } from '@jest/globals';
import { defaultController } from '../../../src/controllers';

describe('Tests the defaultController methods', () => {
  it('should return 400 and "Route not found" message', () => {
    const mockSend = jest.fn((text) => text);
    const mockStatus = jest.fn((code) => ({ send: mockSend, code }));
    const req = {};
    const res = { status: mockStatus };
    defaultController.routeNotFound(req, res);
    expect(mockStatus).toBeCalledWith(404);
    expect(mockSend).toBeCalledWith('Route not found');
  });
});
