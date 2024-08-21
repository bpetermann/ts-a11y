import { AnyNode, Element } from 'domhandler';

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
    const elements = nodes.filter(
      (node) => 'name' in node && node instanceof Element
    );
    return tag ? elements.filter(({ name }) => name === tag) : elements;
  }

  /**
   * Find a element in an array of nodes by tag
   * @param {Element[]} nodes - Array of element to search within
   * @param {string} tag - The tag name to search for
   * @returns {Element | undefined} The first element that matches the tag, or undefined if not found
   */
  static findElementByTag(nodes: Element[], tag: string): Element | undefined {
    return nodes.find((node) => 'name' in node && node.name === tag);
  }

  /**
   * Check if all elements have at least one of the specified attributes
   * @param {string[]} attributes - Array of attribute names to check for
   * @returns {boolean} True if all elements have at least one of the specified attributes, false otherwise
   */
  allElementsHaveAttribute(attributes: string[]): boolean {
    return this.elements.every((element) =>
      attributes.some((attr) => attr in element.attribs)
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
  getElementData(element: Element): string | undefined {
    return 'children' in element &&
      element.children[0] &&
      'data' in element.children[0]
      ? element.children[0].data
      : undefined;
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
  getFirstSibling(element: Element): Element | null {
    let prevNode = element.prev;

    while (prevNode && !(prevNode instanceof Element)) {
      prevNode = prevNode.prev;
    }

    return prevNode;
  }
}
