import { AnyNode, Element, Text } from 'domhandler';

/**
 * Returns the first child element of the given element
 * @param {Element} element - The parent element from which to retrieve the first child.
 * @returns {Element | undefined} - The first child element with a `name` property, or `undefined` if none exists.
 */
export function getFirstChild(element: Element): Element | undefined {
  return element.children.find((childNode) => childNode instanceof Element);
}

/**
 * Returns the first sibling after before the given element
 * @param {Element} element - The element whose next sibling is being sought.
 * @returns {Element | null} The next sibling element, or `null` if none exists.
 */
export function getFirstSibling(element: Element): Element | undefined {
  let nextNode = element?.next;

  while (nextNode && !(nextNode instanceof Element)) {
    nextNode = nextNode.next;
  }

  return nextNode instanceof Element ? nextNode : undefined;
}

/**
 * Returns the first sibling element before the given element
 * @param {Element} element - The element whose previous sibling is being sought.
 * @returns {Element | null} The first sibling element, or `null` if none exists.
 */
export function getPrevSibling(element: Element): Element | undefined {
  let prevNode = element?.prev;

  while (prevNode && !(prevNode instanceof Element) && 'prev' in prevNode) {
    prevNode = prevNode.prev;
  }

  return prevNode instanceof Element ? prevNode : undefined;
}

/**
 * Checks if the given element has an abstract role attached.
 * @param {Element} element - The element to check.
 * @returns {string | undefined} The role of the element, if it is abstract.
 */
export function getAbsractRole(element: Element): string | undefined {
  return [
    'command',
    'composite',
    'input',
    'landmark',
    'range',
    'roletype',
    'section',
    'sectionhead',
    'select',
    'structure',
    'widget',
    'window',
  ].find((role) => role === element.attribs?.['role']);
}

/**
 * Recursively determines whether an Element and all of its child elements
 * can safely have the `aria-hidden` attribute applied.
 *
 * This method checks if the element itself is focusable or contains any focusable child elements.
 *
 * @param {Element} element - The Element to check.
 * @returns {boolean} `true` if the element and all its child elements can have `aria-hidden`; otherwise, `false`.
 */
export function canHaveAriaHidden(element: Element): boolean {
  if (!isNotFocusable(element)) {
    return false;
  }

  const childElements = element.children.filter(
    (child) => child instanceof Element
  );

  return childElements.every((child) => canHaveAriaHidden(child));
}

function isNotFocusable(node: Element): boolean {
  const isFormControl = ['input', 'button', 'textarea', 'select'].includes(
    node.name
  );
  const isLink = node.name === 'a';

  const hasTabIndex = node.attribs?.['tabindex'];
  const tabIndexValue = hasTabIndex !== undefined ? +hasTabIndex : null;
  const hasNegativeTabIndex = tabIndexValue === -1;
  const hasPositiveTabIndex = tabIndexValue !== null && tabIndexValue > -1;

  const hasInert = node.attribs?.['inert'] !== undefined;
  const hasContentEditable = node.attribs?.['contenteditable'] === 'true';
  const hasButtonRole = node.attribs?.['role'] === 'button';
  const hasHref = node.attribs?.['href'] !== undefined;
  const isDisabled = node.attribs?.['disabled'] !== undefined;

  return !(
    (isFormControl && !hasNegativeTabIndex && !isDisabled && !hasInert) ||
    (isLink && hasHref && !hasInert) ||
    hasContentEditable ||
    hasPositiveTabIndex ||
    (hasButtonRole && !hasNegativeTabIndex)
  );
}
