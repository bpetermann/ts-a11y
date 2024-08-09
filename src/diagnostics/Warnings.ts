export const enum Warning {
  shouldExist = 'shouldExist',
  shouldBeUnique = 'shouldBeUnique',
  hasMissingAttribute = 'hasMissingAttribute',
}

export const warnings = {
  html: {
    [Warning.hasMissingAttribute]:
      '[Refa11y] Define the natual language of your page by using the lang attribute on the <html> element',
  },
  title: {
    [Warning.shouldExist]:
      "[Refa11y] Name your page using the <title> element to help screen reader users tell which page they're on",
  },
  meta: {
    [Warning.shouldExist]:
      '[Refa11y] Set the viewport meta tag to not prohibit zooming',
    [Warning.hasMissingAttribute]:
      '[Refa11y] Set the viewport meta tag to not prohibit zooming',
  },
  main: {
    [Warning.shouldBeUnique]:
      '[Refa11y] There should only be one visible <main> element on the page',
  },
  nav: {
    [Warning.hasMissingAttribute]:
      '[Refa11y] If you have more than one <nav> element on a page, you should label them with either aria-labelledby or aria-label to make them distinguishable.',
  },
} as const;

export const defaultMessages = {
  [Warning.shouldExist]: '[Refa11y] The element should exist: ',
  [Warning.shouldBeUnique]: '[Refa11y] The element should be unique: ',
  [Warning.hasMissingAttribute]:
    '[Refa11y] The element has one or more missing attributes: ',
};

export const tsxWarning = {
  button: {
    'aria-label':
      '[Refa11y] Button elements should have an aria-label for accessibility.',
  },
} as const;
