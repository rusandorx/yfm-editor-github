import {builders} from 'prosemirror-test-builder';
import {createMarkupChecker} from '../../../../tests/sameMarkup';
import {ExtensionsManager} from '../../../core';
import {BaseNode, BaseSpecsPreset} from '../../base/specs';
import {blockquoteNodeName, italicMarkName} from '../../markdown/specs';
import {TabsNode, YfmTabsSpecs} from './YfmTabsSpecs';

const mockRandomValue = 0.123456789;
const generatedId = mockRandomValue.toString(36).substr(2, 8);

beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(mockRandomValue);
});

afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
});

const {schema, parser, serializer} = new ExtensionsManager({
    extensions: (builder) => builder.use(BaseSpecsPreset, {}).use(YfmTabsSpecs, {}),
}).buildDeps();

const {doc, p, tab, tabs, tabPanel, tabsList} = builders(schema, {
    doc: {nodeType: BaseNode.Doc},
    p: {nodeType: BaseNode.Paragraph},
    i: {markType: italicMarkName},
    bq: {nodeType: blockquoteNodeName},
    tab: {nodeType: TabsNode.Tab},
    tabPanel: {nodeType: TabsNode.TabPanel},
    tabs: {nodeType: TabsNode.Tabs},
    tabsList: {nodeType: TabsNode.TabsList},
}) as PMTestBuilderResult<'doc' | 'p' | 'bq' | 'tab' | 'tabPanel' | 'tabs' | 'tabsList'>;

const {same} = createMarkupChecker({parser, serializer});

describe('YfmTabs extension', () => {
    it('should parse yfm-tabs', () => {
        const markup = `
{% list tabs %}

- panel title 1

  panel content 1

- panel title 2

  panel content 2

{% endlist %}
`.trim();

        same(
            markup,
            doc(
                tabs(
                    {
                        class: 'yfm-tabs',
                        'data-diplodoc-group': `defaultTabsGroup-${generatedId}`,
                    },
                    tabsList(
                        {
                            class: 'yfm-tab-list',
                            role: 'tablist',
                        },
                        tab(
                            {
                                id: 'unknown',
                                class: 'yfm-tab active',
                                role: 'tab',
                                'aria-controls': generatedId,
                                'aria-selected': 'true',
                                tabindex: '0',
                                'data-diplodoc-is-active': 'true',
                                'data-diplodoc-id': 'panel-title-1',
                                'data-diplodoc-key': 'panel%20title%201',
                            },
                            'panel title 1',
                        ),
                        tab(
                            {
                                id: 'unknown',
                                class: 'yfm-tab',
                                role: 'tab',
                                'aria-controls': generatedId,
                                'aria-selected': 'false',
                                tabindex: '-1',
                                'data-diplodoc-is-active': 'false',
                                'data-diplodoc-id': 'panel-title-2',
                                'data-diplodoc-key': 'panel%20title%202',
                            },
                            'panel title 2',
                        ),
                    ),
                    tabPanel(
                        {
                            id: generatedId,
                            class: 'yfm-tab-panel active',
                            role: 'tabpanel',
                            'data-title': 'panel title 1',
                            'aria-labelledby': 'panel-title-1',
                        },
                        p('panel content 1'),
                    ),
                    tabPanel(
                        {
                            id: generatedId,
                            class: 'yfm-tab-panel',
                            role: 'tabpanel',
                            'data-title': 'panel title 2',
                            'aria-labelledby': 'panel-title-2',
                        },
                        p('panel content 2'),
                    ),
                ),
            ),
        );
    });
});
