export const warnings = {
  heading: {
    shouldExist:
      '[Zugang] Do not skip heading levels: always start with <h1>, followed by <h2>, and so on.',
    shouldBeUnique: '[Zugang] The <html> element should be unique.',
  },
  meta: {
    shouldExist:
      '[Zugang] Ensure the viewport meta tag is set to allow zooming.',
    hasMissingAttribute:
      '[Zugang] Ensure the viewport meta tag is set to allow zooming.',
  },
  html: {
    hasMissingAttribute:
      '[Zugang] Define the natural language of your page by using the lang attribute on the <html> element.',
  },
  title: {
    shouldExist:
      '[Zugang] Use the <title> element to name your page, helping screen reader users identify the page they are on.',
    shouldBeUnique: '[Zugang] The <title> element should be unique.',
  },
  h1: "[Zugang] A page should generally have a single <h1> element that describes the page's content, similar to the <title> element.",
  main: '[Zugang] There should only be one visible <main> element on the page.',
  nav: '[Zugang] If you have more than one <nav> element on a page, label them with aria-labelledby or aria-label to make them distinguishable.',
  link: {
    avoid:
      '[Zugang] Avoid generic link text, as it makes it difficult for users to anticipate what the links lead to. Link text: ',
    wrongAttribute: '[Zugang] Links should not have a click event.',
    tabindex:
      '[Zugang] Avoid using negative tabindex values on elements that require direct keyboard navigation, like links or buttons.',
    mail: '[Zugang] Include the email address in the link text to help users who find switching between applications tedious.',
  },
  div: '[Zugang] In most cases, it is better to use the native HTML <button> element instead of assigning a role="button" or adding onclick events to a <div>, unless you have specific reasons for doing so.',
};
