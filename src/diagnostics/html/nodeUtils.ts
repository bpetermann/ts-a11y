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
    return domNodes.some((node) => 'attribs' in node && node.attribs[attr]);
  },
};

const { findNode, findNodes, allNodesHaveAttribute, hasAttribute } = nodeUtils;
export { findNode, findNodes, allNodesHaveAttribute, hasAttribute };
