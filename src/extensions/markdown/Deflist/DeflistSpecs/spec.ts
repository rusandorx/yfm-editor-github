import type {NodeSpec} from 'prosemirror-model';
import type {DeflistSpecsOptions} from './index';
import {DeflistNode} from './const';
import {PlaceholderOptions} from '../../../../utils/placeholder';

const DEFAULT_PLACEHOLDERS = {
    Term: 'Definition term',
    Desc: 'Definition description',
};

export const getSpec = (
    opts?: DeflistSpecsOptions,
    placeholder?: PlaceholderOptions,
): Record<DeflistNode, NodeSpec> => ({
    [DeflistNode.List]: {
        group: 'block',
        content: `(${DeflistNode.Term} ${DeflistNode.Desc})+`,
        parseDOM: [{tag: 'dl'}],
        toDOM() {
            return ['dl', 0];
        },
        selectable: true,
        allowSelection: true,
        complex: 'root',
    },

    [DeflistNode.Term]: {
        defining: true,
        group: 'block',
        content: 'inline*',
        parseDOM: [{tag: 'dt'}],
        toDOM() {
            return ['dt', 0];
        },
        placeholder: {
            content:
                placeholder?.[DeflistNode.Term] ??
                opts?.deflistTermPlaceholder ??
                DEFAULT_PLACEHOLDERS.Term,
            alwaysVisible: true,
        },
        selectable: false,
        allowSelection: false,
        complex: 'leaf',
    },

    [DeflistNode.Desc]: {
        defining: true,
        group: 'block',
        content: 'block+',
        parseDOM: [{tag: 'dd'}],
        toDOM() {
            return ['dd', 0];
        },
        placeholder: {
            content:
                placeholder?.[DeflistNode.Desc] ??
                opts?.deflistDescPlaceholder ??
                DEFAULT_PLACEHOLDERS.Desc,
            alwaysVisible: true,
        },
        selectable: false,
        allowSelection: false,
        complex: 'leaf',
    },
});
