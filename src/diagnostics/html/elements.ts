import { AnyNode, Element, Text } from 'domhandler';

export default class ElementList {
  public elements: Element[];

  constructor(nodes: AnyNode[], tag?: string) {
    this.elements = this.findElementsByTag(nodes, tag);
  }

  /**
   * Filter an array of nodes by tag
   * @param {AnyNode[]} nodes - Array of nodes to filter
   * @param {string} tag - The tag name to filter by
   * @returns {Element[]} Array of elements that match the tag
   */
  findElementsByTag(nodes: AnyNode[], tag?: string): Element[] {
    return nodes.filter(
      (node) => node instanceof Element && (!tag || node.name === tag)
    ) as Element[];
  }

  /**
   * Find a element in an array of nodes by tag
   * @param {Element[]} nodes - Array of element to search within
   * @param {string} tag - The tag name to search for
   * @returns {Element | undefined} The first element that matches the tag, or undefined if not found
   */
  static findElementByTag(nodes: Element[], tag: string): Element | undefined {
    return nodes.find(({ name }) => name === tag);
  }

  /**
   * Check if all elements have at least one of the specified attributes
   * @param {string[]} attributes - Array of attribute names to check for
   * @returns {boolean} True if all elements have at least one of the specified attributes, false otherwise
   */
  allElementsHaveAttribute(attributes: string[]): boolean {
    return this.elements.every(({ attribs }) =>
      attributes.some((attr) => attr in attribs)
    );
  }

  /**
   * Check if any element in an array has a specific attribute
   * @param {string} attribute - The attribute name to check for
   * @returns {boolean} True if at least one element has the attribute, false otherwise
   */
  anyElementHasAttribute(attribute: string): boolean {
    return this.elements.some((element) => element.attribs[attribute]);
  }

  /**
   * Get all attributes from a element
   * @param {Element} element - The element to retrieve attributes from
   * @returns {{ [name: string]: string } | undefined} Object containing the element's attributes, or undefined if none exist
   */
  getElementAttributes(element: Element): { [name: string]: string } | {} {
    return element.attribs;
  }

  /**
   * Get a specific attribute from an element
   * @param {Element} element - The element to retrieve the attribute from
   * @param {string} attr - The element name to retrieve
   * @returns {string | undefined} The element's value, or undefined if the attribute does not exist
   */
  getElementAttribute(element: Element, attr: string): string | undefined {
    return element.attribs?.[attr];
  }

  /**
   * Get the text data from a element
   * @param {Element} element - The element to retrieve data from
   * @returns {string | undefined} The text content of the element, or undefined if not applicable
   */
  getElementData({ children }: Element): string | undefined {
    return children[0] instanceof Text ? children[0].data : undefined;
  }

  /**
   * Returns the first child element of the given element
   * @param {Element} element - The parent element from which to retrieve the first child.
   * @returns {Element | undefined} - The first child element with a `name` property, or `undefined` if none exists.
   */
  getFirstChild(element: Element): Element | undefined {
    return element.children.find((childNode) => childNode instanceof Element);
  }

  /**
   * Returns the first sibling element before the given element
   * @param {Element} element - The element whose previous sibling is being sought.
   * @returns {Element | null} The first sibling element, or `null` if none exists.
   */
  getPrevSibling(element: Element): Element | undefined {
    let prevNode = element?.prev;

    while (prevNode && !(prevNode instanceof Element) && 'prev' in prevNode) {
      prevNode = prevNode.prev;
    }

    return prevNode instanceof Element ? prevNode : undefined;
  }

  /**
   * Returns the first sibling after before the given element
   * @param {Element} element - The element whose next sibling is being sought.
   * @returns {Element | null} The next sibling element, or `null` if none exists.
   */
  getFirstSibling(element: Element): Element | undefined {
    let nextNode = element?.next;

    while (nextNode && !(nextNode instanceof Element)) {
      nextNode = nextNode.next;
    }

    return nextNode instanceof Element ? nextNode : undefined;
  }

  /**
   * Returns the longest consecutive sequence of elements.
   * @param {Element[]} elements - The array of elements to be checked.
   * @param {string} relationship - The next element to look for (e.g. child, sibling).
   * @returns {Element[]} The elements that make up the longest sequence.
   */
  getLongestSequence(
    elements: Element[],
    relationship: 'child' | 'sibling' = 'child'
  ): Element[] {
    const relation = relationship === 'child' ? 'Child' : 'Sibling';
    let longestSequence: Element[] = [];

    for (let index = 0; index < elements.length; index++) {
      let element = elements[index];
      const sequence = [element];

      while (this[`next${relation}HasTag`](element, elements[0].name)) {
        index++;
        element = this[`getFirst${relation}`](element)!;
        sequence.push(element);
      }

      if (sequence.length > longestSequence.length) {
        longestSequence = sequence;
      }
    }

    return longestSequence;
  }

  private nextChildHasTag(element: Element, tag: string): boolean {
    return this.getFirstChild(element)?.name === tag;
  }

  private nextSiblingHasTag(element: Element, tag: string): boolean {
    return this.getFirstSibling(element)?.name === tag;
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
  static canHaveAriaHidden(element: Element): boolean {
    if (!ElementList.isNotFocusable(element)) {
      return false;
    }

    const childElements = element.children.filter(
      (child) => child instanceof Element
    );

    return childElements.every((child) => ElementList.canHaveAriaHidden(child));
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
