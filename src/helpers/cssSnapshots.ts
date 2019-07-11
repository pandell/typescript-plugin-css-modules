import { extractICSS, IICSSExports } from 'icss-utils';
import postcss from 'postcss';
import postcssIcssSelectors from 'postcss-icss-selectors';
import ts_module from 'typescript/lib/tsserverlibrary';
import reserved from 'reserved-words';
import { transformClasses } from './classTransforms';
import { Options } from '../options';

const NOT_CAMELCASE_REGEXP = /[\-_]/;
const processor = postcss(postcssIcssSelectors({ mode: 'local' }));

const classNameToProperty = (className: string) => `'${className}': string;`;
const classNameToNamedExport = (className: string) =>
  `export const ${className}: string;`;

const flattenClassNames = (
  previousValue: string[] = [],
  currentValue: string[],
) => previousValue.concat(currentValue);

export const getClasses = (css: string) => {
  try {
    const processedCss = processor.process(css);
    return extractICSS(processedCss.root).icssExports;
  } catch (e) {
    return {};
  }
};

export const createExports = (classes: IICSSExports, options: Options) => {
  const isCamelCase = (className: string) =>
    !NOT_CAMELCASE_REGEXP.test(className);
  const isReservedWord = (className: string) => !reserved.check(className);

  const processedClasses = Object.keys(classes)
    .map(transformClasses(options.camelCase))
    .reduce(flattenClassNames, []);
  const camelCasedKeys = processedClasses
    .filter(isCamelCase)
    .filter(isReservedWord)
    .map(classNameToNamedExport);

  const defaultExport = `\
declare const classes: {
  ${processedClasses.map(classNameToProperty).join('\n  ')}
};
export default classes;
`;

  if (camelCasedKeys.length) {
    return defaultExport + camelCasedKeys.join('\n') + '\n';
  }
  return defaultExport;
};

export const getDtsSnapshot = (
  ts: typeof ts_module,
  scriptSnapshot: ts.IScriptSnapshot,
  options: Options,
) => {
  const css = scriptSnapshot.getText(0, scriptSnapshot.getLength());
  const classes = getClasses(css);
  const dts = createExports(classes, options);
  return ts.ScriptSnapshot.fromString(dts);
};
