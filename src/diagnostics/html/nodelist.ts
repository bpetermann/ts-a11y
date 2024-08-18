import { AnyNode } from 'domhandler';

export default class NodeList {
  public nodes: AnyNode[];

  constructor(nodes: AnyNode[], tag?: string) {
    this.nodes = tag ? this.findNodesByTag(nodes, tag) : nodes;
  }

  /**
   * Find a node in an array of nodes by tag
   * @param {AnyNode[]} nodes - Array of nodes to search within
   * @param {string} tag - The tag name to search for
   * @returns {AnyNode | undefined} The first node that matches the tag, or undefined if not found
   */
  static findNodeByTag(nodes: AnyNode[], tag: string): AnyNode | undefined {
    return nodes.find((node) => 'name' in node && node.name === tag);
  }

  /**
   * Filter an array of nodes by tag
   * @param {AnyNode[]} nodes - Array of nodes to filter
   * @param {string} tag - The tag name to filter by
   * @returns {AnyNode[]} Array of nodes that match the tag
   */
  findNodesByTag(nodes: AnyNode[], tag: string): AnyNode[] {
    return nodes.filter((node) => 'name' in node && node.name === tag);
  }

  /**
   * Check if all nodes have at least one of the specified attributes
   * @param {string[]} attributes - Array of attribute names to check for
   * @returns {boolean} True if all nodes have at least one of the specified attributes, false otherwise
   */
  allNodesHaveAttribute(attributes: string[]): boolean {
    return this.nodes.every(
      (node) =>
        'attribs' in node && attributes.some((attr) => attr in node.attribs)
    );
  }

  /**
   * Check if any node in an array has a specific attribute
   * @param {string} attribute - The attribute name to check for
   * @returns {boolean} True if at least one node has the attribute, false otherwise
   */
  anyNodeHasAttribute(attribute: string): boolean {
    return this.nodes.some(
      (node) => node && 'attribs' in node && node.attribs[attribute]
    );
  }

  /**
   * Get all attributes from a node
   * @param {AnyNode} node - The node to retrieve attributes from
   * @returns {{ [name: string]: string } | undefined} Object containing the node's attributes, or undefined if none exist
   */
  getNodeAttributes(node: AnyNode): { [name: string]: string } | {} {
    return 'attribs' in node ? node.attribs : {};
  }

  /**
   * Get a specific attribute from a node
   * @param {AnyNode} node - The node to retrieve the attribute from
   * @param {string} attr - The attribute name to retrieve
   * @returns {string | undefined} The attribute's value, or undefined if the attribute does not exist
   */
  getNodeAttribute(node: AnyNode, attr: string): string | undefined {
    return 'attribs' in node ? node.attribs[attr] : undefined;
  }

  /**
   * Get the text data from a node
   * @param {AnyNode} node - The node to retrieve data from
   * @returns {string | undefined} The text content of the node, or undefined if not applicable
   */
  getNodeData(node: AnyNode): string | undefined {
    return 'children' in node && node.children[0] && 'data' in node.children[0]
      ? node.children[0].data
      : undefined;
  }
}
