import { Arlo } from '.';

describe(Arlo, () => {

  it('Should convert to JSON', () => {
    const arlo = new Arlo();

    expect(() => {
      JSON.stringify(arlo)
    }).not.toThrow();
  });
});