const rollup = require('rollup').rollup;
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');

rollup({
    entry: 'src/index',
    plugins: [
        babel(),
        nodeResolve({ jsnext: true, main: true }),
        commonjs()
    ]
}).then((bundle) => {
    bundle.write({
        dest: 'dest/knockout.register.cjs.js',
        format: 'cjs'
    });
    bundle.write({
        dest: 'dest/knockout.register.es6.js',
        format: 'es6'
    });
}).catch(console.error);