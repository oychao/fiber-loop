import typescript from 'rollup-plugin-typescript2';

export default {
  input: './src/index.ts',
  output: [
    {
      file: 'bin/index.js',
      format: 'umd',
      name: 'helloUmd'
    }
  ],
  plugins: [
    typescript({
      tsconfigOverride: {
        compilerOptions: { declaration: true }
      }
    })
  ],
  external: ['fs', 'path', 'jsonfile']
};
