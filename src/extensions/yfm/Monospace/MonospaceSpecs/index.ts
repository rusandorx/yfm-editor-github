import log from '@doc-tools/transform/lib/log';
import yfmPlugin from '@doc-tools/transform/lib/plugins/monospace';

import type {ExtensionAuto} from '../../../../core';
import {markTypeFactory} from '../../../../utils/schema';

export const monospaceMarkName = 'monospace';
export const monospaceType = markTypeFactory(monospaceMarkName);

export const MonospaceSpecs: ExtensionAuto = (builder) => {
    builder
        .configureMd((md) => md.use(yfmPlugin, {log}))
        .addMark(monospaceMarkName, () => ({
            spec: {
                parseDOM: [{tag: 'samp'}],
                toDOM() {
                    return ['samp'];
                },
            },
            fromYfm: {
                tokenSpec: {
                    name: monospaceMarkName,
                    type: 'mark',
                },
            },
            toYfm: {
                open: '##',
                close: '##',
                mixable: true,
                expelEnclosingWhitespace: true,
            },
        }));
};
