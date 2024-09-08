import { AnyNode, Element } from 'domhandler';
import { HTMLElement } from './Element';

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
   * Find a element in an array of nodes by tag
   * @param {Element[]} nodes - Array of element to search within
   * @param {string} tag - The tag name to search for
   * @returns {Element | undefined} The first element that matches the tag, or undefined if not found
   */
  static findElementByTag(nodes: Element[], tag: string): Element | undefined {
    return nodes.find(({ name }) => name === tag);
  }

  /**
   * Returns the longest consecutive sequence of elements.
   * @param {Element[]} elements - The array of elements to be checked.
   * @param {string} relationship - The next element to look for (e.g. child, sibling).
   * @returns {Element[]} The elements that make up the longest sequence.
   */
  static getLongestSequence(
    elements: Element[],
    relationship: 'child' | 'sibling' = 'child'
  ): Element[] {
    const relation = relationship === 'child' ? 'Child' : 'Sibling';
    const getRelationFn = {
      Child: HTMLElement.getFirstChild,
      Sibling: HTMLElement.getFirstSibling,
    };
    let longestSequence: Element[] = [];

    for (let index = 0; index < elements.length; index++) {
      let element = elements[index];
      const sequence = [element];

      while (getRelationFn[relation](element)?.name === elements[0].name) {
        index++;
        element = getRelationFn[relation](element)!;
        sequence.push(element);
      }

      if (sequence.length > longestSequence.length) {
        longestSequence = sequence;
      }
    }

    return longestSequence;
  }
}
