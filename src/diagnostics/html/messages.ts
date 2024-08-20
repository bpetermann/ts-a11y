export const messages = {
  heading: {
    shouldExist:
      '[Zugang] Do not skip heading levels: always start with <h1>, followed by <h2>, and so on.',
  },
  meta: {
    shouldExist:
      '[Zugang] Ensure the viewport meta tag is set to allow zooming.',
    hasMissingAttribute:
      '[Zugang] Ensure the viewport meta tag is set to allow zooming.',
  },
  html: {
    shouldBeUnique: '[Zugang] The <html> element should be unique.',
    hasMissingAttribute:
      '[Zugang] Define the natural language of your page by using the lang attribute on the <html> element.',
  },
  title: {
    shouldExist:
      '[Zugang] Use the <title> element to name your page, helping screen reader users identify the page they are on.',
    shouldBeUnique: '[Zugang] The <title> element should be unique.',
  },
  h1: {
    shouldBeUnique:
      "[Zugang] A page should generally have a single <h1> element that describes the page's content, similar to the <title> element.",
  },
  main: {
    shouldBeUnique:
      '[Zugang] There should only be one visible <main> element on the page.',
  },
  nav: {
    label:
      '[Zugang] If you have more than one <nav> element on a page, label them with aria-labelledby or aria-label to make them distinguishable.',
  },
  link: {
    avoid:
      '[Zugang] Avoid generic link text, as it makes it difficult for users to anticipate what the links lead to. Link text: ',
    onclick: '[Zugang] Links should not have a click event.',
    tabindex:
      '[Zugang] Avoid using negative tabindex values on elements that require direct keyboard navigation, like links or buttons.',
    mail: '[Zugang] Include the email address in the link text to help users who find switching between applications tedious.',
    current:
      '[Zugang] If any of the links point to the current page, mark that link with aria-current="page". This improves navigation and helps users, especially those using assistive technologies, understand their current location.',
    list: '[Zugang] Complex navigations can be challenging for blind screen reader users, as they may struggle to understand the size and structure. Consider wrapping long lists of links in a <ul> to provide additional semantic information.',
    'aria-hidden':
      '[Zugang] Do not use aria-hidden="true" on focusable elements.',
  },
  div: {
    button:
      '[Zugang] In most cases, it is better to use the native HTML <button> element instead of assigning a role="button" or adding onclick events to a <div>, unless you have specific reasons for doing so.',
    expanded:
      '[Zugang] Set the "aria-expanded" attribute on the element that is controlling, not on the controlled element',
  },
  button: {
    switchRole:
      '[Zugang] A button that toggles a seeting must communicate whether it is active, the "aria-checked" attribute represents the current state of the widget that the switch role is applied to. ',
    disabled:
      '[Zugang] Do not disable buttons as they do not provide valuable feedback. Users should always have the option to interact with a button.',
    tabindex:
      '[Zugang] Avoid using positive values for the tab index, as it then quickly becomes difficult to maintain a meaningful order.',
  },
  input: {
    label:
      '[Zugang] Screen reader users may have difficulty recognizing the purpose of a field if you do not label your input elements by either nesting them in a label element, specifying a label as a sibling, or creating a reference with “aria-labelledby”.',
  },
  fieldset: {
    legend:
      '[Zugang] Always provide a legend to the fieldset element. The legend should be the first child of the fieldset and must not be nested within other elements. Otherwise, it will not provide an accessible name for the fieldset.',
  },
  img: {
    alt: '[Zugang] Use the alt attribute to specify a text description of the image. For purely decorative images, use an empty alt attribute to indicate that the image should be ignored by supporting technologies.',
  },
};
