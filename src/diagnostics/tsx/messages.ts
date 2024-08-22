export const messages = {
  button: {
    'aria-label':
      '[Zugang] Button elements should have an aria-label for accessibility.',
      switch:
      '[Zugang] A button that toggles a setting must indicate its active state using the "aria-checked" attribute, which reflects the widget’s current state.',
  },
  img: {
    alt: '[Zugang] Use the alt attribute to provide a text description for images. For decorative images, use an empty alt attribute to indicate they should be ignored by assistive technologies.',
  },

} as const;
