import { Camera } from './camera';

describe(Camera, () => {
  describe(Camera.prototype.get, () => {
    it('Should have get', () => {
      expect(Camera.prototype.get).toBeDefined();
    });
  });
});