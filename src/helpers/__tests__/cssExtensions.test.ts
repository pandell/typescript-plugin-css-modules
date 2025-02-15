import { createIsCSS, createIsRelativeCSS } from '../cssExtensions';

describe('utils / cssExtensions', () => {
  describe('isCSS', () => {
    const isCSS = createIsCSS();

    it('should match CSS module extensions', () => {
      expect(isCSS('./myfile.module.css')).toBe(true);
      expect(isCSS('./myfile.module.scss')).toBe(false);
      expect(isCSS('./myfile.module.sass')).toBe(false);
      expect(isCSS('./myfile.module.less')).toBe(false);
    });

    it('should not match non-CSS module extensions', () => {
      expect(isCSS('./myfile.css')).toBe(false);
      expect(isCSS('./myfile.scss')).toBe(false);
      expect(isCSS('./myfile.sass')).toBe(false);
      expect(isCSS('./myfile.module.csss')).toBe(false);
    });
  });

  describe('isRelativeCSS', () => {
    const isCSS = createIsCSS();
    const isRelativeCSS = createIsRelativeCSS(isCSS);

    it('should match relative CSS modules', () => {
      expect(isRelativeCSS('./myfile.module.css')).toBe(true);
      expect(isRelativeCSS('../folder/myfile.module.css')).toBe(true);
    });

    it('should not match non-relative CSS modules', () => {
      expect(isRelativeCSS('myfile.module.css')).toBe(false);
    });
  });
});
