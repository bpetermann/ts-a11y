import * as vscode from 'vscode';
import * as jsx from '@babel/types';

export function getElementNameString(
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

export function hasAttribute(
  attribute: string | jsx.JSXIdentifier,
  element: (jsx.JSXAttribute | jsx.JSXSpreadAttribute)[]
) {
  return element.some(
    (attr) => attr.type === 'JSXAttribute' && attr.name.name === attribute
  );
}

function getRange(location: jsx.SourceLocation) {
  return new vscode.Range(
    new vscode.Position(location.start.line - 1, location.start.column),
    new vscode.Position(location.end.line - 1, location.end.column)
  );
}

export function getDiagnostic(location: jsx.SourceLocation, message: string) {
  return new vscode.Diagnostic(
    getRange(location),
    message,
    vscode.DiagnosticSeverity.Warning
  );
}
