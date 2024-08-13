export const warnings = {
  heading: {
    shouldExist:
      '[Refa11y] Do not skip heading levels: always start from <h1>, followed by <h2> and so on.',
    shouldBeUnique: '[Refa11y] The element should be unique: html',
  },
  meta: {
    shouldExist: '[Refa11y] Set the viewport meta tag to not prohibit zooming',
    hasMissingAttribute:
      '[Refa11y] Set the viewport meta tag to not prohibit zooming',
  },
  html: {
    hasMissingAttribute:
      '[Refa11y] Define the natual language of your page by using the lang attribute on the <html> element',
  },
  title: {
    shouldExist:
      "[Refa11y] Name your page using the <title> element to help screen reader users tell which page they're on",
    shouldBeUnique: '[Refa11y] The element should be unique: title',
  },
  h1: "[Refa11y] A page should generally have a single <h1> element that describes the content of the page (similar to the document's <title> element).",
  main: '[Refa11y] There should only be one visible <main> element on the page',
  nav: '[Refa11y] If you have more than one <nav> element on a page, you should label them with either aria-labelledby or aria-label to make them distinguishable.',
  link: '[Refa11y] Avoid generic link text, because it makes it difficult for users to anticipate what these links lead to. Link text: ',
};
