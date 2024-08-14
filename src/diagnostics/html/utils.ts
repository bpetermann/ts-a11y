import { AnyNode } from 'domhandler';

const nodeUtils = {
  findNode: (domNodes: AnyNode[], tag: string) => {
    return domNodes.find((node) => 'name' in node && node.name === tag);
  },
  findNodes: (domNodes: AnyNode[], tag: string) => {
    return domNodes.filter((node) => 'name' in node && node.name === tag);
  },
  allNodesHaveAttribute: (domNodes: AnyNode[], attributes: string[]) => {
    return domNodes.every(
      (node) =>
        'attribs' in node &&
        Object.keys(node.attribs).some((attribs) =>
          attributes.includes(attribs)
        )
    );
  },
  hasAttribute: (domNodes: AnyNode[], attr: string) => {
    return domNodes.some(
      (node) => node && 'attribs' in node && node.attribs[attr]
    );
  },
  getNodeAttributes: (node: AnyNode) => {
    if (!('attribs' in node)) {
      return;
    }
    return node.attribs;
  },
  getNodeAttribute: (node: AnyNode, attr: string) => {
    if (!('attribs' in node) || !(attr in node.attribs)) {
      return;
    }
    return node.attribs[attr];
  },
  getNodeData: (node: AnyNode) => {
    return 'children' in node && node.children[0] && 'data' in node.children[0]
      ? node.children[0].data
      : undefined;
  },
};

const {
  findNode,
  findNodes,
  allNodesHaveAttribute,
  hasAttribute,
  getNodeAttributes,
  getNodeAttribute,
  getNodeData,
} = nodeUtils;
export {
  allNodesHaveAttribute,
  findNode,
  findNodes,
  getNodeAttribute,
  getNodeAttributes,
  getNodeData,
  hasAttribute,
};
