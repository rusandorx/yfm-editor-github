import {chainCommands} from 'prosemirror-commands';
import {liftListItem, sinkListItem, splitListItem} from 'prosemirror-schema-list';
import type {Action, ExtensionAuto, Keymap} from '../../../core';
import {withLogAction} from '../../../utils/keymap';
import {actions} from './actions';
import {ListAction} from './const';
import {ListsInputRulesExtension, ListsInputRulesOptions} from './inputrules';
import {ListsSpecs, blType, liType, olType} from './ListsSpecs';
import {liftIfCursorIsAtBeginningOfItem, toList, joinPrevList} from './commands';

export {ListNode, blType, liType, olType} from './ListsSpecs';

export type ListsOptions = {
    ulKey?: string | null;
    olKey?: string | null;
    ulInputRules?: ListsInputRulesOptions['bulletListInputRule'];
};

export const Lists: ExtensionAuto<ListsOptions> = (builder, opts) => {
    builder.use(ListsSpecs);

    builder.addKeymap(({schema}) => {
        const {ulKey, olKey} = opts ?? {};
        const bindings: Keymap = {};
        if (ulKey) bindings[ulKey] = withLogAction('bulletList', toList(blType(schema)));
        if (olKey) bindings[olKey] = withLogAction('orderedList', toList(olType(schema)));

        return {
            Enter: splitListItem(liType(schema)),
            Tab: sinkListItem(liType(schema)),
            'Shift-Tab': liftListItem(liType(schema)),

            'Mod-[': liftListItem(liType(schema)),
            'Mod-]': sinkListItem(liType(schema)),

            ...bindings,
        };
    });
    builder.addKeymap(
        () => ({
            Backspace: chainCommands(liftIfCursorIsAtBeginningOfItem, joinPrevList),
        }),
        builder.Priority.Low,
    );

    builder.use(ListsInputRulesExtension, {bulletListInputRule: opts?.ulInputRules});

    builder
        .addAction(ListAction.ToBulletList, actions.toBulletList)
        .addAction(ListAction.ToOrderedList, actions.toOrderedList)
        .addAction(ListAction.SinkListItem, actions.sinkListItem)
        .addAction(ListAction.LiftListItem, actions.liftListItem);
};

declare global {
    namespace YfmEditor {
        interface Actions {
            [ListAction.ToBulletList]: Action;
            [ListAction.ToOrderedList]: Action;
            [ListAction.SinkListItem]: Action;
            [ListAction.LiftListItem]: Action;
        }
    }
}
