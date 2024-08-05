import * as vscode from 'vscode';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';

export function getTsxDiagnostics(
  text: string,
  document: vscode.TextDocument
): vscode.Diagnostic[] {
  const diagnostics: vscode.Diagnostic[] = [];

  try {
    const ast = parser.parse(text, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });

    traverse(ast, {
      JSXOpeningElement(path) {
        const elementName = path.node.name;
        let elementNameString = '';

        if (elementName.type === 'JSXIdentifier') {
          elementNameString = elementName.name;
        } else if (elementName.type === 'JSXMemberExpression') {
          let objectName = elementName.object;
          let propertyName = elementName.property;

          if (
            objectName.type === 'JSXIdentifier' &&
            propertyName.type === 'JSXIdentifier'
          ) {
            elementNameString = `${objectName.name}.${propertyName.name}`;
          }
        } else if (elementName.type === 'JSXNamespacedName') {
          elementNameString = `${elementName.namespace.name}:${elementName.name.name}`;
        }

        if (elementNameString === 'button') {
          const hasAriaLabel = path.node.attributes.some((attr) => {
            return (
              attr.type === 'JSXAttribute' && attr.name.name === 'aria-label'
            );
          });

          if (!hasAriaLabel && path.node.loc) {
            const diagnostic = new vscode.Diagnostic(
              new vscode.Range(
                new vscode.Position(
                  path.node.loc.start.line - 1,
                  path.node.loc.start.column
                ),
                new vscode.Position(
                  path.node.loc.end.line - 1,
                  path.node.loc.end.column
                )
              ),
              '[Refa11y] Button elements should have an aria-label for accessibility.',
              vscode.DiagnosticSeverity.Warning
            );
            diagnostics.push(diagnostic);
          }
        }
      },
    });
  } catch (error) {
    console.error('Error parsing code: ', error);
  }

  return diagnostics;
}
