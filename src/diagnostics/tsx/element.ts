import * as jsx from '@babel/types';

export class TSXElement {
  constructor(private node: jsx.JSXElement) {}

  get loc() {
    return this.node.loc;
  }

  /**
   * Retrieves the string name of a JSX element.
   */
  get name(): string | undefined {
    const node = this.node.openingElement;
    switch (node.name.type) {
      case 'JSXIdentifier':
        return node.name.name;
      case 'JSXMemberExpression':
        return this.getMemberExpressionName(node.name);
      default:
        return `${node.name?.namespace?.name}:${node.name?.name?.name}`;
    }
  }

  /**
   * Retrieves the string name of a JSX MemberExpression.
   */
  private getMemberExpressionName(
    elementName: jsx.JSXMemberExpression
  ): string | undefined {
    const { object, property } = elementName;
    if (object.type !== 'JSXIdentifier' || property.type !== 'JSXIdentifier') {
      return undefined;
    }
    return `${object.name}.${property.name}`;
  }

  /**
   * Returns the length of equal consecutive elements.
   */
  getSeuqenceLength(): number {
    let element = this.node;
    let sum = 1;

    while (this.nextchildHasTag(element, this.name)) {
      element = this.getFirstChild(element)!;
      sum++;
    }

    return sum;
  }

  private getFirstChild(element: jsx.JSXElement): jsx.JSXElement | undefined {
    return element.children.find((child) => child.type === 'JSXElement');
  }

  private nextchildHasTag(
    element: jsx.JSXElement,
    tag: string | undefined
  ): boolean {
    if (!tag) {
      return false;
    }

    const child = this.getFirstChild(element);
    return (
      !!child &&
      'name' in child.openingElement.name &&
      child.openingElement.name.name === tag
    );
  }

  /**
   * Checks if the element has a certain attribute.
   */
  hasAttribute(attribute: string | jsx.JSXIdentifier): boolean {
    return this.node.openingElement.attributes.some(
      (attr) => attr.type === 'JSXAttribute' && attr.name.name === attribute
    );
  }

  getAttribute(attribute: string | jsx.JSXIdentifier): string | undefined {
    const jsxAttribute = this.node.openingElement.attributes.find(
      (attr) => attr.type === 'JSXAttribute' && attr.name.name === attribute
    );
    if (
      jsxAttribute &&
      'value' in jsxAttribute &&
      jsxAttribute['value']?.type === 'StringLiteral'
    ) {
      return jsxAttribute.value.value;
    }
  }
}
