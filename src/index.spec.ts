import { Arlo } from './index';

describe(Arlo, () => {

  describe('Properties', () => {
    it('Should have armed property', () => {
      expect(Arlo).toHaveProperty('ARMED');
    });
    
    it('Should have disarmed property', () => {
      expect(Arlo).toHaveProperty('DISARMED');
    });

    it('Should have base station property', () => {
      expect(Arlo).toHaveProperty('BASESTATION');
    });

    it('Should have camera property', () => {
      expect(Arlo).toHaveProperty('CAMERA');
    });

    it('Should have Q property', () => {
      expect(Arlo).toHaveProperty('Q');
    });

    it('Should have siren property', () => {
      expect(Arlo).toHaveProperty('SIREN');
    });

    it('Should have audio property', () => {
      expect(Arlo).toHaveProperty('AUDIO');
    });

    it('Should have battery property', () => {
      expect(Arlo).toHaveProperty('BATTERY');
    });

    it('Should have charging property', () => {
      expect(Arlo).toHaveProperty('CHARGING');
    });

    it('Should have found property', () => {
      expect(Arlo).toHaveProperty('FOUND');
    });

    it('Should have motion property', () => {
        expect(Arlo).toHaveProperty('MOTION');
    });

    it('Should have update property', () => {
        expect(Arlo).toHaveProperty('UPDATE');
    });

    it('Should have snapshot property', () => {
        expect(Arlo).toHaveProperty('FF_SNAPSHOT');
    });
  });
});