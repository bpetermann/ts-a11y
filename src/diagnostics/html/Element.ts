import { Element } from 'domhandler';

export class HTMLElement {
  /**
   * Returns the first child element of the given element.
   * @param {Element} element - The parent element from which to retrieve the first child.
   * @returns {Element | undefined} - The first child element, or `undefined` if none exists.
   */
  static getFirstChild(element: Element): Element | undefined {
    return element.children.find((childNode) => childNode instanceof Element);
  }

  /**
   * Returns the first sibling after before the given element.
   * @param {Element} element - The element whose next sibling is being sought.
   * @returns {Element | undefined} The next sibling element, or `undefined` if none exists.
   */
  static getFirstSibling(element: Element): Element | undefined {
    let nextNode = element.next;

    while (nextNode && !(nextNode instanceof Element)) {
      nextNode = nextNode.next;
    }

    return nextNode instanceof Element ? nextNode : undefined;
  }

  /**
   * Returns the first sibling element before the given element.
   * @param {Element} element - The element whose previous sibling is being sought.
   * @returns {Element | undefined} The first sibling element, or `undefined` if none exists.
   */
  static getPrevSibling(element: Element): Element | undefined {
    let prevNode = element.prev;

    while (prevNode && !(prevNode instanceof Element)) {
      prevNode = prevNode.prev;
    }

    return prevNode instanceof Element ? prevNode : undefined;
  }

  /**
   * Checks if the given element has an abstract role attached.
   * @param {Element} element - The element to check.
   * @returns {string | undefined} The role of the element, if it is abstract.
   */
  static getAbsractRole(element: Element): string | undefined {
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
    ].find((role) => role === element.attribs['role']);
  }

  /**
   * Determines whether an Element and all of its child elements.
   * can safely have the `aria-hidden` attribute applied.
   *
   * @param {Element} element - The Element to check.
   * @returns {boolean} `true` if the element and all its child elements can have `aria-hidden`; otherwise, `false`.
   */
  static canHaveAriaHidden(element: Element): boolean {
    if (!HTMLElement.isNotFocusable(element)) {
      return false;
    }

    const childElements = element.children.filter(
      (child) => child instanceof Element
    );

    return childElements.every((child) => this.canHaveAriaHidden(child));
  }

  static isNotFocusable(node: Element): boolean {
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
}
