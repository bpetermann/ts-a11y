import { AnyNode, Element } from 'domhandler';

export default class NodeOrganizer {
  private domNodes: Map<string, Element[]> = new Map();

  constructor(nodes: AnyNode[]) {
    nodes.forEach((node) => {
      if (node instanceof Element) {
        const tagName = node.name;
        if (!this.domNodes.has(tagName)) {
          this.domNodes.set(tagName, []);
        }
        this.domNodes.get(tagName)?.push(node);
      }
    });
  }

  getNodes(tags: readonly string[]): Element[] {
    return tags.flatMap((tag) => this.domNodes.get(tag) ?? []);
  }
}
