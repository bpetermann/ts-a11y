export const messages = {
  heading: {
    shouldExist:
      '[Zugang] Do not skip heading levels. Always start with an <h1> and follow with <h2>, <h3>, and so on.',
  },
  meta: {
    shouldExist:
      '[Zugang] Ensure the viewport meta tag is configured to allow zooming for accessibility.',
    hasMissingAttribute:
      '[Zugang] Ensure the viewport meta tag is configured to allow zooming for accessibility.',
  },
  html: {
    shouldBeUnique: '[Zugang] The <html> element should be unique on the page.',
    hasMissingAttribute:
      '[Zugang] Specify the page’s natural language by using the lang attribute on the <html> element.',
  },
  title: {
    shouldExist:
      '[Zugang] Use the <title> element to provide a clear name for your page. This helps screen reader users identify the page.',
    shouldBeUnique:
      '[Zugang] The <title> element should be unique for each page.',
  },
  h1: {
    shouldBeUnique:
      '[Zugang] Each page should have a single <h1> element that summarizes the content, similar to the purpose of the <title> element.',
  },
  main: {
    shouldBeUnique:
      '[Zugang] Only one visible <main> element should exist on a page.',
  },
  nav: {
    label:
      '[Zugang] When using more than one <nav> element on a page, label them with aria-labelledby or aria-label to differentiate them for assistive technology users.',
  },
  link: {
    onclick: '[Zugang] Avoid assigning click events directly to links.',
    tabindex:
      '[Zugang] Avoid using negative tabindex values on elements like links or buttons that require direct keyboard navigation.',
    mail: '[Zugang] Include the email address in the link text to help users who may find switching between applications difficult.',
    generic:
      '[Zugang] Avoid using generic link text, as it can be unclear to users what the link leads to. Link text: ',
    current:
      '[Zugang] If a link points to the current page, mark it with aria-current="page" to enhance navigation for users, particularly those using assistive technologies.',
    list: '[Zugang] Wrap long lists of links in a <ul> element to provide semantic information that aids screen reader users in navigating complex menus.',
    'aria-hidden':
      '[Zugang] Avoid using aria-hidden="true" on focusable elements, as it can disrupt accessibility.',
  },
  div: {
    button:
      '[Zugang] Use the native HTML <button> element instead of assigning a role="button" or adding onclick events to a <div>, unless a specific use case justifies it.',
    expanded:
      '[Zugang] The "aria-expanded" attribute should be applied to the element that controls the expansion, not the element being expanded.',
    soup: '[Zugang] Nesting too many <div>s can create complex, hard-to-navigate structures for screen readers and other assistive technologies. This can make it difficult for users with disabilities to understand the content, reducing accessibility and usability. Keep the HTML structure simple and meaningful by using proper semantic elements instead of excessive <div> nesting.',
    'aria-hidden':
      'A focusable element, or an element containing focusable children, should not have the aria-hidden attribute. Doing so can lead to accessibility issues, as it hides content from assistive technologies while still being interactive.',
    abstract:
      "[Zugang] Don't use abstract roles in your sites and applications. They are for use by browsers. Abstract role found: ",
  },
  button: {
    switch:
      '[Zugang] A button that toggles a setting must indicate its active state using the "aria-checked" attribute, which reflects the widget’s current state.',
    disabled:
      '[Zugang] Avoid disabling buttons, as they do not provide useful feedback. Users should always be able to interact with a button.',
    tabindex:
      '[Zugang] Avoid using positive tabindex values, as they can make it difficult to maintain a meaningful focus order.',
    text: '[Zugang] A button without visible text or an image child must include aria-label, aria-labelledby, or title for accessibility.',
    abstract:
      "[Zugang] Don't use abstract roles in your sites and applications. They are for use by browsers.",
    'aria-label':
      '[Zugang] Button elements should have an aria-label for accessibility.',
  },
  input: {
    label:
      '[Zugang] Ensure input elements have accessible labels by either nesting them within a <label> element, placing the label as a sibling, or using "aria-labelledby" to associate the label.',
  },
  fieldset: {
    legend:
      '[Zugang] Always provide a legend for the <fieldset> element. The legend should be the first child of the fieldset and not nested within other elements to ensure it provides an accessible name.',
  },
  img: {
    alt: '[Zugang] Use the alt attribute to provide a text description for images. For decorative images, use an empty alt attribute to indicate they should be ignored by assistive technologies.',
    repeated:
      '[Zugang] The same alt attribute is being used on multiple images. Screen readers rely on unique and descriptive alt text to convey the content of each image. Please ensure that each image has a distinct alt attribute.',
    generic:
      '[Zugang] Provide meaningful alternative text that accurately describes the image content, rather than simple details like file types (e.g., .png, .jpg) or the fact that it is an image. For decorative images, use an empty alt attribute to indicate they should be ignored by assistive technologies. Text: ',
  },
  section: {
    label:
      '[Zugang] When using more than one <section> element on a page, label them with aria-labelledby or aria-label to differentiate them for assistive technology users.',
  },
  aria: {
    hidden:
      'A focusable element, or an element containing focusable children, should not have the aria-hidden attribute. Doing so can lead to accessibility issues, as it hides content from assistive technologies while still being interactive.',
  },
};
