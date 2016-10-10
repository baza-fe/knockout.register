const rollup = require('rollup').rollup;
const babelrc = require('babelrc-rollup').default;
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');

rollup({
    entry: 'src/index',
    plugins: [
        babel(babelrc()),
        nodeResolve({ jsnext: true, main: true }),
        commonjs()
    ]
}).then((bundle) => {
    bundle.write({
        dest: 'dest/knockout.register.iife.js',
        moduleName: 'knockout.register',
        format: 'iife'
    });
    bundle.write({
        dest: 'dest/knockout.register.es.js',
        format: 'es'
    });
}).catch(console.error);