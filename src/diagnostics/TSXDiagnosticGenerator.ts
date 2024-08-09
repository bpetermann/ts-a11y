import * as vscode from 'vscode';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import { tsxWarning } from './Warnings';
import * as jsx from '@babel/types';

export class TSXDiagnosticGenerator {
  private diagnostics: vscode.Diagnostic[] = [];

  constructor(private text: string, private document: vscode.TextDocument) {}

  public generateDiagnostics(): vscode.Diagnostic[] {
    try {
      const ast = parser.parse(this.text, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
      });

      traverse(ast, {
        JSXOpeningElement: (path) => this.checkElement(path.node),
      });
    } catch (error) {
      console.error('Error parsing code: ', error);
    }

    return this.diagnostics;
  }

  private checkElement(node: jsx.JSXOpeningElement): void {
    const { name, loc, attributes } = node;
    const elementNameString = this.getElementNameString(name);

    if (!loc) {
      return;
    }

    switch (elementNameString) {
      case 'button':
        if (!this.hasAttribute('aria-label', attributes)) {
          this.diagnostics.push(
            this.createDiagnostic(loc, tsxWarning.button['aria-label'])
          );
        }
        break;
    }
  }

  private getElementNameString(
    elementName:
      | jsx.JSXIdentifier
      | jsx.JSXMemberExpression
      | jsx.JSXNamespacedName
  ): string | undefined {
    switch (elementName.type) {
      case 'JSXIdentifier':
        return elementName.name;
      case 'JSXMemberExpression':
        const objectName = elementName.object;
        const propertyName = elementName.property;
        if (
          objectName.type !== 'JSXIdentifier' ||
          propertyName.type !== 'JSXIdentifier'
        ) {
          return undefined;
        }
        return `${objectName.name}.${propertyName.name}`;
      default:
        return `${elementName.namespace.name}:${elementName.name.name}`;
    }
  }

  private hasAttribute(
    attribute: string | jsx.JSXIdentifier,
    element: (jsx.JSXAttribute | jsx.JSXSpreadAttribute)[]
  ): boolean {
    return element.some(
      (attr) => attr.type === 'JSXAttribute' && attr.name.name === attribute
    );
  }

  private createDiagnostic(
    location: jsx.SourceLocation,
    message: string
  ): vscode.Diagnostic {
    return new vscode.Diagnostic(
      this.getRange(location),
      message,
      vscode.DiagnosticSeverity.Warning
    );
  }

  private getRange(location: jsx.SourceLocation): vscode.Range {
    return new vscode.Range(
      new vscode.Position(location.start.line - 1, location.start.column),
      new vscode.Position(location.end.line - 1, location.end.column)
    );
  }
}
