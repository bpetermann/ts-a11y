export const warnings = {
  html: {
    lang: '[Refa11y] Define the natual language of your page by using the lang attribute on the <html> element',
  },
  button: {
    'aria-label':
      '[Refa11y] Button elements should have an aria-label for accessibility.',
  },
  title: {
    shouldExist:
      "[Refa11y] Name your page using the <title> element to help screen reader users tell which page they're on",
  },
} as const;
