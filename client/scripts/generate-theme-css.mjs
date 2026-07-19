import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { colors, transitions, typography } from '../src/theme/index.js';

const toVariables = (tokens) => Object.entries(tokens)
  .map(([name, value]) => `  --color-${name}: ${value};`)
  .join('\n');

const output = `/* Generated from src/theme. Run npm run generate:theme after token changes. */
@import url('${typography.googleFontsUrl}');

:root {
  --font-sans: ${typography.fontFamily.primary};
  --font-display: ${typography.fontFamily.secondary};
  --font-mono: ${typography.fontFamily.mono};
  --transition-theme: ${transitions.duration.theme};
  --easing-standard: ${transitions.easing.standard};
${toVariables(colors.light)}
}

:root[data-theme='dark'] {
${toVariables(colors.dark)}
}
`;

await writeFile(resolve('src/styles/theme.css'), output, 'utf8');
