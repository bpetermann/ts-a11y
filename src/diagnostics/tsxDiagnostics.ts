import * as vscode from 'vscode';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as jsx from '@babel/types';
import { warnings } from './warnings';

function getElementNameString(
  elementName:
    | jsx.JSXIdentifier
    | jsx.JSXMemberExpression
    | jsx.JSXNamespacedName
) {
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
        return;
      }
      return `${objectName.name}.${propertyName.name}`;
    default:
      return `${elementName.namespace.name}:${elementName.name.name}`;
  }
}

function hasAttribute(
  attribute: string | jsx.JSXIdentifier,
  element: (jsx.JSXAttribute | jsx.JSXSpreadAttribute)[]
) {
  return element.some(
    (attr) => attr.type === 'JSXAttribute' && attr.name.name === attribute
  );
}

function getDiagnostic(location: jsx.SourceLocation, message: string) {
  return new vscode.Diagnostic(
    new vscode.Range(
      new vscode.Position(location.start.line - 1, location.start.column),
      new vscode.Position(location.end.line - 1, location.end.column)
    ),
    message,
    vscode.DiagnosticSeverity.Warning
  );
}

export function getTsxDiagnostics(
  text: string,
  _document: vscode.TextDocument
): vscode.Diagnostic[] {
  const diagnostics: vscode.Diagnostic[] = [];

  try {
    const ast = parser.parse(text, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });

    traverse(ast, {
      JSXOpeningElement(path) {
        const { name, loc, attributes } = path.node;
        const elementNameString = getElementNameString(name);

        switch (elementNameString) {
          case 'button':
            if (!hasAttribute('aria-label', attributes) && loc) {
              diagnostics.push(
                getDiagnostic(loc, warnings.button['aria-label'])
              );
            }
            break;
        }
      },
    });
  } catch (error) {
    console.error('Error parsing code: ', error);
  }

  return diagnostics;
}
