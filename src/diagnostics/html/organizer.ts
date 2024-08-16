import { AnyNode } from 'domhandler';

export default class NodeOrganizer {
  private domNodes: Map<string, AnyNode[]> = new Map();

  constructor(nodes: AnyNode[]) {
    nodes.forEach((node) => {
      if ('name' in node) {
        const tagName = node.name as string;
        if (!this.domNodes.has(tagName)) {
          this.domNodes.set(tagName, []);
        }
        this.domNodes.get(tagName)?.push(node);
      }
    });
  }

  getNodes(tags: readonly string[]): AnyNode[] {
    return tags.flatMap((tag) => this.domNodes.get(tag) ?? []);
  }
}
