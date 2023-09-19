#!usr/bin/node

/* eslint-env node */

// This is used only for esbuild compatability testing

const esbuild = require('esbuild');
const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const {sassPlugin} = require('esbuild-sass-plugin');

const paths = {
    esmBuild: path.join(__dirname, '../../build/esm'),
    esbuildToTest: path.join(__dirname, './esbuild-to-test.mjs'),
    tempTest: path.join(__dirname, './temp-test.mjs'),
    localBuild: path.join(__dirname, './build'),
    compiledEsBuildToTest: path.join(__dirname, './build/esbuild-to-test.js'),
};

const getConfig = (entryPoints) => ({
    entryPoints: entryPoints,
    bundle: true,
    format: 'esm',
    logLevel: 'info',
    outdir: paths.localBuild,
    loader: {
        '.tsx': 'tsx',
        '.eot': 'dataurl',
        '.woff': 'dataurl',
        '.woff2': 'dataurl',
        '.ttf': 'dataurl',
    },
    plugins: [sassPlugin()],
});

if (fs.existsSync(paths.esmBuild)) {
    esbuild
        .build(getConfig([paths.esbuildToTest]))
        .then(() => fsPromises.readFile(paths.compiledEsBuildToTest, {encoding: 'utf-8'}))
        .then((data) => {
            const start = data.lastIndexOf('export {');
            const end = data.indexOf('}', start);
            let exportString = data.slice(start, end + 1);
            exportString = exportString
                .split('\n')
                .map((line) => {
                    const [, ...words] = line.split(/\s+/);
                    return words.length === 3 && words[1] === 'as' ? '  ' + words[2] : line;
                })
                .join('\n');
            return fsPromises.writeFile(paths.tempTest, exportString + " from '../../build/esm'");
        })
        .then(() => esbuild.build(getConfig([paths.tempTest])))
        .then(() => console.log('Built completed'))
        .finally(() => {
            // cleanup
            if (paths.localBuild)
                fs.rmSync(paths.localBuild, {
                    force: true,
                    recursive: true,
                });
            if (fs.existsSync(paths.tempTest)) fs.rmSync(paths.tempTest);
        });
} else {
    console.error('Error: No build found');
}
