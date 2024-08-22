import * as jsx from '@babel/types';

export class TSXElement {
  constructor(private node: jsx.JSXOpeningElement) {}

  get loc() {
    return this.node.loc;
  }

  /**
   * Retrieves the string name of a JSX element.
   */
  get name(): string | undefined {
    switch (this.node.name.type) {
      case 'JSXIdentifier':
        return this.node.name.name;
      case 'JSXMemberExpression':
        return this.getMemberExpressionName(this.node.name);
      default:
        return `${this.node.name?.namespace?.name}:${this.node.name?.name?.name}`;
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
   * Checks if the element has a certain attribute.
   */
  hasAttribute(attribute: string | jsx.JSXIdentifier): boolean {
    return this.node.attributes.some(
      (attr) => attr.type === 'JSXAttribute' && attr.name.name === attribute
    );
  }

  getAttribute(attribute: string | jsx.JSXIdentifier): string | undefined {
    const jsxAttribute = this.node.attributes.find(
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
