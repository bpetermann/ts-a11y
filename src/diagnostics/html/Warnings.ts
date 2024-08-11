import { Tag, PartialRecord, WarningKey } from '../../types/html';

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
  h1: {
    shouldBeUnique:
      "[Refa11y] A page should generally have a single <h1> element that describes the content of the page (similar to the document's <title> element).",
  },
  h2: {
    hasMissingDependency:
      '[Refa11y] Do not skip heading levels: always start from <h1>, followed by <h2> and so on.',
  },
  h3: {
    hasMissingDependency:
      '[Refa11y] Do not skip heading levels: always start from <h1>, followed by <h2> and so on.',
  },
  h4: {
    hasMissingDependency:
      '[Refa11y] Do not skip heading levels: always start from <h1>, followed by <h2> and so on.',
  },
  h5: {
    hasMissingDependency:
      '[Refa11y] Do not skip heading levels: always start from <h1>, followed by <h2> and so on.',
  },
  h6: {
    hasMissingDependency:
      '[Refa11y] Do not skip heading levels: always start from <h1>, followed by <h2> and so on.',
  },
} as const;

export const defaultMessages = {
  shouldExist: '[Refa11y] The element should exist: ',
  shouldBeUnique: '[Refa11y] The element should be unique: ',
  hasMissingAttribute:
    '[Refa11y] The element has one or more missing attributes: ',
  hasMissingDependency:
    '[Refa11y] The element has one or more missing dependencies',
} as const;
