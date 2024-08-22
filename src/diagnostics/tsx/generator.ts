import * as vscode from 'vscode';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as jsx from '@babel/types';
import { ButtonValidator } from './validators/button';
import { Validator } from './validators/validator';

export class TSXDiagnosticGenerator {
  private diagnostics: vscode.Diagnostic[] = [];

  constructor(
    private text: string,
    private validators: Validator[] = [new ButtonValidator()]
  ) {}

  /**
   * Generates diagnostics for the TSX code.
   */
  public generateDiagnostics(): vscode.Diagnostic[] {
    try {
      const ast = this.parseText();

      traverse(ast, {
        JSXOpeningElement: (path) => this.checkElement(path.node),
      });
    } catch (error) {
      console.error('Error parsing code: ', error);
    }

    return this.diagnostics;
  }

  /**
   * Checks a JSX element and adds diagnostics if issues are found.
   */
  private checkElement(node: jsx.JSXOpeningElement): void {
    const name = this.getElementName(node.name);

    if (!name) {
      return;
    }

    const validator = this.validators.find(({ tags }) => tags.includes(name));

    validator?.validate(node).forEach(({ diagnostic }) => {
      this.diagnostics.push(diagnostic);
    });
  }

  /**
   * Retrieves the string name of a JSX element.
   */
  private getElementName(
    elementName:
      | jsx.JSXIdentifier
      | jsx.JSXMemberExpression
      | jsx.JSXNamespacedName
  ): string | undefined {
    switch (elementName.type) {
      case 'JSXIdentifier':
        return elementName.name;
      case 'JSXMemberExpression':
        return this.getMemberExpressionName(elementName);
      default:
        return `${elementName?.namespace?.name}:${elementName?.name?.name}`;
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
   * Parse the provided code as an entire program.
   */
  private parseText() {
    return parser.parse(this.text, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });
  }
}
