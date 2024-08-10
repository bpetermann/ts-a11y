import { Tag, PartialRecord, WarningKey } from '../types';

export const warnings: {
  [key in Tag]: PartialRecord<WarningKey, string>;
} = {
  html: {
    hasMissingAttribute:
      '[Refa11y] Define the natual language of your page by using the lang attribute on the <html> element',
  },
  title: {
    shouldExist:
      "[Refa11y] Name your page using the <title> element to help screen reader users tell which page they're on",
  },
  meta: {
    shouldExist: '[Refa11y] Set the viewport meta tag to not prohibit zooming',
    hasMissingAttribute:
      '[Refa11y] Set the viewport meta tag to not prohibit zooming',
  },
  main: {
    shouldBeUnique:
      '[Refa11y] There should only be one visible <main> element on the page',
  },
  nav: {
    hasMissingAttribute:
      '[Refa11y] If you have more than one <nav> element on a page, you should label them with either aria-labelledby or aria-label to make them distinguishable.',
  },
} as const;

export const defaultMessages = {
  shouldExist: '[Refa11y] The element should exist: ',
  shouldBeUnique: '[Refa11y] The element should be unique: ',
  hasMissingAttribute:
    '[Refa11y] The element has one or more missing attributes: ',
} as const;

export const tsxWarning = {
  button: {
    'aria-label':
      '[Refa11y] Button elements should have an aria-label for accessibility.',
  },
} as const;
