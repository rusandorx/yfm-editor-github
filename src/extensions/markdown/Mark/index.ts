import type {Action, ExtensionAuto} from '../../../core';
import {createToggleMarkAction} from '../../../utils/actions';
import {markInputRule} from '../../../utils/inputrules';
import {markMarkName, markMarkType, MarkSpecs} from './MarkSpecs';

export {markMarkName, markMarkType} from './MarkSpecs';
/** @deprecated Use `markMarkName` instead  */
export const mark = markMarkName;
const mAction = 'mark';

export const Mark: ExtensionAuto = (builder) => {
    builder.use(MarkSpecs);

    builder
        .addAction(mAction, ({schema}) => createToggleMarkAction(markMarkType(schema)))
        .addInputRules(({schema}) => ({
            rules: [
                markInputRule({open: '==', close: '==', ignoreBetween: '='}, markMarkType(schema)),
            ],
        }));
};

declare global {
    namespace YfmEditor {
        interface Actions {
            [mAction]: Action;
        }
    }
}
