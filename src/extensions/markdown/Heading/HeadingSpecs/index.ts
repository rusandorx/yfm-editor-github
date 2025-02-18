import type {Node, NodeSpec} from 'prosemirror-model';
import type {ExtensionAuto} from '../../../../core';
import {nodeTypeFactory} from '../../../../utils/schema';

export const headingNodeName = 'heading';
export const headingLevelAttr = 'level';
export const headingType = nodeTypeFactory(headingNodeName);

const DEFAULT_PLACEHOLDER = (node: Node) => 'Heading ' + node.attrs[headingLevelAttr];

export type HeadingSpecsOptions = {
    headingPlaceholder?: NonNullable<NodeSpec['placeholder']>['content'];
};

export const HeadingSpecs: ExtensionAuto<HeadingSpecsOptions> = (builder, opts) => {
    const {headingPlaceholder} = opts ?? {};

    builder.addNode(headingNodeName, () => ({
        spec: {
            attrs: {[headingLevelAttr]: {default: 1}},
            content: '(text | inline)*',
            group: 'block',
            defining: true,
            parseDOM: [
                {tag: 'h1', attrs: {[headingLevelAttr]: 1}},
                {tag: 'h2', attrs: {[headingLevelAttr]: 2}},
                {tag: 'h3', attrs: {[headingLevelAttr]: 3}},
                {tag: 'h4', attrs: {[headingLevelAttr]: 4}},
                {tag: 'h5', attrs: {[headingLevelAttr]: 5}},
                {tag: 'h6', attrs: {[headingLevelAttr]: 6}},
            ],
            toDOM(node) {
                return ['h' + node.attrs[headingLevelAttr], 0];
            },
            placeholder: {
                content: headingPlaceholder ?? DEFAULT_PLACEHOLDER,
                alwaysVisible: true,
            },
        },
        fromYfm: {
            tokenSpec: {
                name: headingNodeName,
                type: 'block',
                getAttrs: (tok) => ({[headingLevelAttr]: Number(tok.tag.slice(1))}),
            },
        },
        toYfm: (state, node) => {
            state.write(state.repeat('#', node.attrs[headingLevelAttr]) + ' ');
            state.renderInline(node);
            state.closeBlock(node);
        },
    }));
};
