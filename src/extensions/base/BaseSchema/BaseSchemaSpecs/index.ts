import type {NodeSpec} from 'prosemirror-model';
import type {ExtensionAuto} from '../../../../core';
import {nodeTypeFactory} from '../../../../utils/schema';

export enum BaseNode {
    Doc = 'doc',
    Text = 'text',
    Paragraph = 'paragraph',
}

export const pType = nodeTypeFactory(BaseNode.Paragraph);

export type BaseSchemaSpecsOptions = {
    paragraphPlaceholder?: NonNullable<NodeSpec['placeholder']>['content'];
};

export const BaseSchemaSpecs: ExtensionAuto<BaseSchemaSpecsOptions> = (builder, opts) => {
    const {paragraphPlaceholder} = opts;

    builder
        .addNode(BaseNode.Doc, () => ({
            spec: {
                content: 'block+',
            },
            fromYfm: {tokenSpec: {name: BaseNode.Doc, type: 'block', ignore: true}},
            toYfm: () => {
                throw new Error('Unexpected toYfm() call on doc node');
            },
        }))
        .addNode(BaseNode.Text, () => ({
            spec: {
                group: 'inline',
            },
            fromYfm: {tokenSpec: {name: BaseNode.Text, type: 'node', ignore: true}},
            toYfm: (state, node, parent) => {
                const {escapeText} = parent.type.spec;
                state.text(node.text, escapeText ?? !state.isAutolink);
            },
        }))
        .addNode(BaseNode.Paragraph, () => ({
            spec: {
                content: 'inline*',
                group: 'block',
                parseDOM: [{tag: 'p'}],
                toDOM() {
                    return ['p', 0];
                },
                placeholder: paragraphPlaceholder
                    ? {
                          content: paragraphPlaceholder,
                          alwaysVisible: false,
                      }
                    : undefined,
            },
            fromYfm: {tokenSpec: {name: BaseNode.Paragraph, type: 'block'}},
            toYfm: (state, node) => {
                state.renderInline(node);
                state.closeBlock(node);
            },
        }));
};
