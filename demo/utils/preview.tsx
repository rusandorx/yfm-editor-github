import React from 'react';
import type {Decorator} from '@storybook/react';
import {configure as configureUikit, ThemeProvider} from '@gravity-ui/uikit';
import {configure as configureComponents} from '@gravity-ui/components';
import {configure as configureYfmEditor} from '../../src';

import '@gravity-ui/uikit/styles/styles.scss';

const light = {name: 'light', value: '#FFFFFF'};
const dark = {name: 'dark', value: '#2D2C33'};
export const backgrounds = {
    defaultValue: '#FFFFFF',
    values: [light, dark],
};

export const withThemeProvider: Decorator = (StoryItem, context) => {
    return (
        <ThemeProvider theme={context.globals.theme}>
            <StoryItem {...context} />
        </ThemeProvider>
    );
};

export const withLang: Decorator = (StoryItem, context) => {
    const lang = context.globals.lang;
    configureUikit({lang});
    configureComponents({lang});
    configureYfmEditor({lang});

    return <StoryItem {...context} />;
};
