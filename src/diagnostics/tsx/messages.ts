export const messages = {
  button: {
    'aria-label':
      '[Zugang] Button elements should have an aria-label for accessibility.',
    switch:
      '[Zugang] A button that toggles a setting must indicate its active state using the "aria-checked" attribute, which reflects the widget’s current state.',
    text: '[Zugang] A button without visible text or an image child must include aria-label, aria-labelledby, or visible text for accessibility.',
  },
  img: {
    alt: '[Zugang] Use the alt attribute to provide a text description for images. For decorative images, use an empty alt attribute to indicate they should be ignored by assistive technologies.',
    generic:
      '[Zugang] Provide meaningful alternative text that accurately describes the image content, rather than simple details like file types (e.g., .png, .jpg) or the fact that it is an image. For decorative images, use an empty alt attribute to indicate they should be ignored by assistive technologies. Text: ',
  },
  div: {
    soup: '[Zugang] Nesting too many <div>s can create complex, hard-to-navigate structures for screen readers and other assistive technologies. This can make it difficult for users with disabilities to understand the content, reducing accessibility and usability. Keep the HTML structure simple and meaningful by using proper semantic elements instead of excessive <div> nesting.',
  },
  link: {
    onclick: '[Zugang] Avoid assigning click events directly to links.',
    generic:
      '[Zugang] Avoid using generic link text, as it can be unclear to users what the link leads to. Link text: ',
    mail: '[Zugang] Include the email address in the link text to help users who may find switching between applications difficult.',
  },
} as const;
