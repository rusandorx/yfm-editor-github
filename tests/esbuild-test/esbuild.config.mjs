// This is used only for testing of esbuild compatability

import * as esbuild from 'esbuild';
import {sassPlugin} from "esbuild-sass-plugin";
import * as fs from "fs";

await esbuild.build({
    entryPoints: ['./esbuild-to-test.mjs'],
    bundle: true,
    format: 'esm',
    logLevel: 'info',
    outdir: './build',
    loader: {
        '.tsx': 'tsx',
        '.eot': 'dataurl',
        '.woff': 'dataurl',
        '.woff2': 'dataurl',
        '.ttf': 'dataurl',
    },
    plugins: [sassPlugin()],
});

if (fs.existsSync('./build'))
    fs.rmSync('./build', {force: true, recursive: true});
