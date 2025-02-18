import type {Action, ExtensionAuto} from '../../../core';
import {createToggleMarkAction} from '../../../utils/actions';
import {markInputRule} from '../../../utils/inputrules';
import {subscriptMarkName, SubscriptSpecs, subscriptType} from './SubscriptSpecs';

export {subscriptMarkName, subscriptType} from './SubscriptSpecs';
/** @deprecated Use `subscriptMarkName` instead */
export const subscript = subscriptMarkName;
const subAction = 'subscript';

export const Subscript: ExtensionAuto = (builder) => {
    builder.use(SubscriptSpecs);

    builder
        .addAction(subAction, ({schema}) => createToggleMarkAction(subscriptType(schema)))
        .addInputRules(({schema}) => ({
            rules: [
                markInputRule({open: '~', close: '~', ignoreBetween: '~'}, subscriptType(schema)),
            ],
        }));
};

declare global {
    namespace YfmEditor {
        interface Actions {
            [subAction]: Action;
        }
    }
}
