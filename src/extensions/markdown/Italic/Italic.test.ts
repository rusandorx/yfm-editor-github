import {builders} from 'prosemirror-test-builder';
import {createMarkupChecker} from '../../../../tests/sameMarkup';
import {parseDOM} from '../../../../tests/parse-dom';
import {ExtensionsManager} from '../../../core';
import {BaseNode, BaseSpecsPreset} from '../../base/specs';
import {italicMarkName, ItalicSpecs} from './ItalicSpecs';

const {schema, parser, serializer} = new ExtensionsManager({
    extensions: (builder) => builder.use(BaseSpecsPreset, {}).use(ItalicSpecs),
}).buildDeps();

const {doc, p, i} = builders(schema, {
    doc: {nodeType: BaseNode.Doc},
    p: {nodeType: BaseNode.Paragraph},
    i: {markType: italicMarkName},
}) as PMTestBuilderResult<'doc' | 'p', 'i'>;

const {same} = createMarkupChecker({parser, serializer});

describe('Italic extension', () => {
    it('should parse italic *', () => same('*hello!*', doc(p(i('hello!')))));

    it.skip('should parse italic _', () => same('_hello!_', doc(p(i('hello!')))));

    it('should parse italic inside text', () =>
        same('he*llo wor*ld!', doc(p('he', i('llo wor'), 'ld!'))));

    it('should parse html - em tag', () => {
        parseDOM(schema, '<p><em>text in em</em></p>', doc(p(i('text in em'))));
    });

    it('should parse html - i tag', () => {
        parseDOM(schema, '<div><i>text in i</i></div>', doc(p(i('text in i'))));
    });

    it('should parse html - font-style:italic', () => {
        parseDOM(
            schema,
            '<div style="font-style:italic">text with styles</div>',
            doc(p(i('text with styles'))),
        );
    });
});
