import {toggleMark} from 'prosemirror-commands';
import {withLogAction} from '../../../utils/keymap';
import {createToggleMarkAction} from '../../../utils/actions';
import type {Action, ExtensionAuto} from '../../../core';
import {markInputRule} from '../../../utils/inputrules';

import {italicMarkName, ItalicSpecs, italicType} from './ItalicSpecs';

export {italicMarkName, italicType} from './ItalicSpecs';
/** @deprecated Use `italicMarkName` instead */
export const italic = italicMarkName;
const iAction = 'italic';

export type ItalicOptions = {
    italicKey?: string | null;
};

export const Italic: ExtensionAuto<ItalicOptions> = (builder, opts) => {
    builder.use(ItalicSpecs);

    builder.addAction(iAction, ({schema}) => createToggleMarkAction(italicType(schema)));

    builder.addInputRules(({schema}) => ({
        rules: [
            markInputRule({open: '*', close: '*', ignoreBetween: '*'}, italicType(schema)),
            markInputRule({open: '_', close: '_', ignoreBetween: '_'}, italicType(schema)),
        ],
    }));

    if (opts?.italicKey) {
        const {italicKey} = opts;
        builder.addKeymap(({schema}) => ({
            [italicKey]: withLogAction('italic', toggleMark(italicType(schema))),
        }));
    }
};

declare global {
    namespace YfmEditor {
        interface Actions {
            [iAction]: Action;
        }
    }
}
