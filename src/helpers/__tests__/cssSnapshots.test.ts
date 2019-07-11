import { readFileSync } from 'fs';
import { IICSSExports } from 'icss-utils';
import { join } from 'path';
import { createExports, getClasses } from '../cssSnapshots';
import { Options } from '../../options';

const testFileNames = ['test.module.css', 'empty.module.css'];

describe('utils / cssSnapshots', () => {
  testFileNames.forEach((fileName) => {
    let classes: IICSSExports;
    const testFile = readFileSync(
      join(__dirname, 'fixtures', fileName),
      'utf8',
    );

    beforeAll(() => {
      classes = getClasses(testFile);
    });

    describe(`with file '${fileName}'`, () => {
      describe('getClasses', () => {
        it('should return an object matching expected CSS', () => {
          expect(classes).toMatchSnapshot();
        });
      });

      describe('createExports', () => {
        it.each<Options>([{}, { camelCase: true }])(
          'should create an exports file (with options %p)',
          (options) => {
            const exports = createExports(classes, options);
            expect(exports).toMatchSnapshot();
          },
        );
      });
    });
  });
});
