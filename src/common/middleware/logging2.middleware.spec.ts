import { Logging2Middleware } from './logging2.middleware';

describe('Logging2Middleware', () => {
  it('should be defined', () => {
    expect(new Logging2Middleware()).toBeDefined();
  });
});
