import {builders} from 'prosemirror-test-builder';
import {createMarkupChecker} from '../../../../tests/sameMarkup';
import {parseDOM} from '../../../../tests/parse-dom';
import {ExtensionsManager} from '../../../core';
import {BaseNode, BaseSpecsPreset} from '../../base/specs';
import {blockquoteNodeName, BlockquoteSpecs} from './BlockquoteSpecs';

const {schema, parser, serializer} = new ExtensionsManager({
    extensions: (builder) => builder.use(BaseSpecsPreset, {}).use(BlockquoteSpecs),
}).buildDeps();

const {doc, p, q} = builders(schema, {
    doc: {nodeType: BaseNode.Doc},
    p: {nodeType: BaseNode.Paragraph},
    q: {nodeType: blockquoteNodeName},
}) as PMTestBuilderResult<'doc' | 'p' | 'q'>;

const {same} = createMarkupChecker({parser, serializer});

describe('Blockquote extension', () => {
    it('should parse a blockquote', () => same('> hello!', doc(q(p('hello!')))));

    it('should parse a nested blockquote', () => same('> > hello!', doc(q(q(p('hello!'))))));

    it('should parse a blockquote with few paragraphs', () => {
        same(['> hello', '>', '> world!'].join('\n'), doc(q(p('hello'), p('world!'))));
    });

    it('should parse html - blockquote tag', () => {
        parseDOM(
            schema,
            '<div><blockquote>text in blockquote</blockquote></div>',
            doc(q(p('text in blockquote'))),
        );
    });
});
