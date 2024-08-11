import { AnyNode } from 'domhandler';
import { Tag } from '../../types/html';

export default class NodeList {
  private nodes: AnyNode[] = [];

  get length() {
    return this.nodes.length;
  }

  get first(): AnyNode | undefined {
    return this.nodes[0];
  }

  set(nodes: AnyNode[], tag: Tag) {
    this.nodes = nodes.filter((node) => 'name' in node && node.name === tag);
  }

  public allNodesHaveAttribs(attribs: string[]): boolean {
    return this.nodes.every((node) =>
      this.hasAnyRequiredAttribute(node, attribs)
    );
  }

  private hasAnyRequiredAttribute(node: AnyNode, attribs: string[]): boolean {
    return (
      'attribs' in node &&
      Object.keys(node.attribs).some((key) => attribs.includes(key))
    );
  }

  public anyNodeHasAttribs(attribs: string[]): boolean {
    return attribs.every((attr) => this.hasAttribute(attr));
  }

  public hasAttribute(attr: string): boolean {
    return this.nodes.some((node) => 'attribs' in node && node.attribs[attr]);
  }
}
