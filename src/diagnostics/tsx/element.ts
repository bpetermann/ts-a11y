import * as jsx from '@babel/types';

export class TSXElement {
  constructor(private node: jsx.JSXElement) {}

  /**
   * Retrieves the source location of the JSX element.
   * @returns {jsx.SourceLocation | null} The location information.
   */
  get loc() {
    return this.node.loc;
  }

  /**
   * Retrieves the string name of the JSX element.
   * @returns {string | undefined} The name of the JSX element, or undefined if it cannot be determined.
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
   * Retrieves the text content of the first text child in the JSX element.
   * @returns {string} The text content, or an empty string if no text child is found.
   */
  get text(): string {
    return (
      (this.node.children.find(({ type }) => type === 'JSXText') as jsx.JSXText)
        ?.value ?? ''
    );
  }

  get children() {
    return this.node.children;
  }

  get element() {
    return this.node;
  }

  /**
   * Calculates the length of consecutive elements with the same tag.
   * @returns {number} The number of consecutive elements with the same tag.
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

  /**
   * Finds a direct child element with a specific tag name.
   * @param {string} tag - The tag name to search for.
   * @returns {jsx.JSXElement | undefined} The child JSX element with the specified tag, or undefined if not found.
   */
  getChild(tag: string): jsx.JSXElement | undefined {
    return this.node.children.find(
      (child) =>
        child.type === 'JSXElement' &&
        'name' in child.openingElement.name &&
        child.openingElement.name.name === tag
    ) as jsx.JSXElement;
  }

  /**
   * Checks if the JSX element has a specified attribute.
   * @param {string | jsx.JSXIdentifier} attribute - The attribute name to check.
   * @returns {boolean} True if the attribute is present, otherwise false.
   */
  hasAttribute(attribute: string | jsx.JSXIdentifier): boolean {
    return this.node.openingElement.attributes.some(
      (attr) => attr.type === 'JSXAttribute' && attr.name.name === attribute
    );
  }

  /**
   * Retrieves a list of attribute names from the JSX element.
   * @returns {string[]} An array of attribute names.
   */
  getAttributes(): string[] {
    return this.node.openingElement.attributes
      .map((attr) => {
        if (
          attr.type === 'JSXAttribute' &&
          attr.name.type === 'JSXIdentifier'
        ) {
          return attr.name.name;
        }
      })
      .filter((attr) => typeof attr === 'string');
  }

  /**
   * Retrieves the value of a specific attribute from the JSX element.
   * @param {string | jsx.JSXIdentifier} attribute - The attribute name to retrieve the value for.
   * @returns {string | undefined} The value of the attribute, or undefined if not found.
   */
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

  /**
   * Checks if the next child element has the same tag name as the current element.
   * @private
   * @param {jsx.JSXElement} element - The current JSX element.
   * @param {string | undefined} tag - The tag name to check for.
   * @returns {boolean} True if the next child element has the same tag, otherwise false.
   */
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
   * Retrieves the string name from a JSX MemberExpression.
   * @private
   * @param {jsx.JSXMemberExpression} elementName - The JSX MemberExpression node.
   * @returns {string | undefined} The full name of the member expression, or undefined if it cannot be determined.
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
   * Retrieves the first child element that is a JSXElement.
   * @private
   * @param {jsx.JSXElement} element - The parent JSX element.
   * @returns {jsx.JSXElement | undefined} The first child JSX element, or undefined if not found.
   */
  private getFirstChild(element: jsx.JSXElement): jsx.JSXElement | undefined {
    return element.children.find((child) => child.type === 'JSXElement');
  }

  /**
   * Recursively determines whether a JSX element and all of its child elements
   * can safely have the `aria-hidden` attribute applied.
   *
   * This method checks if the element itself is focusable or contains any focusable
   * child elements. If any element in the hierarchy is focusable, applying `aria-hidden`
   * would create accessibility issues, so the method returns `false`.
   * Otherwise, it returns `true`, indicating that `aria-hidden` can be safely applied
   * to the element and all of its descendants.
   *
   * @param {jsx.JSXElement} element - The JSX element to check.
   * @returns {boolean} `true` if the element and all its child elements can have `aria-hidden`; otherwise, `false`.
   */
  static canHaveAriaHidden(element: jsx.JSXElement): boolean {
    if (!TSXElement.isNotFocusable(element)) {
      return false;
    }

    const getChildElements = (
      element: jsx.JSXElement | jsx.JSXFragment
    ): jsx.JSXElement[] => {
      return element.children.flatMap((child) => {
        if (child.type === 'JSXElement') {
          return child;
        } else if (child.type === 'JSXFragment') {
          return getChildElements(child);
        } else {
          return [];
        }
      });
    };

    const childElements = getChildElements(element);
    return childElements.every((child) => TSXElement.canHaveAriaHidden(child));
  }

  static isNotFocusable(node: jsx.JSXElement): boolean {
    const isIdentifier = node.openingElement.name.type === 'JSXIdentifier';
    const asIdentifier = node.openingElement.name as jsx.JSXIdentifier;

    const formElements = ['input', 'button', 'textarea', 'select'];
    const isFormControl =
      isIdentifier && formElements.includes(asIdentifier.name);

    const isLink = isIdentifier && asIdentifier.name === 'a';

    const allAttributes = node.openingElement.attributes.filter(
      (attr) => attr.type === 'JSXAttribute'
    );

    const getAttributeValue = (attrName: string): string | undefined =>
      (
        allAttributes.find(
          ({ name, value }) =>
            name.name === attrName && value?.type === 'StringLiteral'
        )?.value as jsx.StringLiteral
      )?.value;

    const hasTabIndex = getAttributeValue('tabindex');
    const tabIndexValue = hasTabIndex !== undefined ? +hasTabIndex : null;
    const hasNegativeTabIndex = tabIndexValue === -1;
    const hasPositiveTabIndex = tabIndexValue !== null && tabIndexValue > -1;

    const hasInert = getAttributeValue('inert') !== undefined;
    const hasContentEditable = getAttributeValue('contenteditable') === 'true';
    const hasButtonRole = getAttributeValue('role') === 'button';
    const hasHref = getAttributeValue('href') !== undefined;
    const isDisabled = getAttributeValue('disabled') !== undefined;

    return !(
      (isFormControl && !hasNegativeTabIndex && !isDisabled && !hasInert) ||
      (isLink && hasHref && !hasInert) ||
      hasContentEditable ||
      hasPositiveTabIndex ||
      (hasButtonRole && !hasNegativeTabIndex)
    );
  }
}
