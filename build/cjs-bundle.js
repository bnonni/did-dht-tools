import esbuild from 'esbuild';
import packageJson from '../package.json' assert { type: 'json' };

// Create a list of dependencies to exclude
const excludeList = [];
for (const dependency in packageJson.dependencies) {
  excludeList.push(dependency);
}

// Build for both the main module and the CLI
esbuild.build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  external: excludeList,
  format: 'cjs',
  sourcemap: true,
  platform: 'node',
  outfile: 'dist/cjs/index.js',
  allowOverwrite: true,
});

// Build the CLI file
esbuild.build({
  entryPoints: ['./bin/tool5.ts'],
  bundle: true,
  external: excludeList,
  format: 'cjs',
  sourcemap: true,
  platform: 'node',
  outfile: 'dist/cjs/tool5.js',
  allowOverwrite: true,
});
