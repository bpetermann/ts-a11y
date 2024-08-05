import * as vscode from 'vscode';
import { DomUtils, parseDocument } from 'htmlparser2';

export function getHtmlDiagnostics(
  text: string,
  document: vscode.TextDocument
): vscode.Diagnostic[] {
  const diagnostics: vscode.Diagnostic[] = [];

  try {
    const parsedDocument = parseDocument(text);

    const checkElement = (
      node: any,
      elementName: string,
      attributeName: string,
      message: string
    ) => {
      if (node.name === elementName) {
        const hasAttribute = node.attribs && node.attribs[attributeName];
        if (!hasAttribute) {
          const loc =
            node.startIndex !== undefined && node.endIndex !== undefined
              ? new vscode.Range(
                  document.positionAt(node.startIndex),
                  document.positionAt(node.endIndex)
                )
              : new vscode.Range(
                  new vscode.Position(0, 0),
                  new vscode.Position(0, 0)
                );

          const diagnostic = new vscode.Diagnostic(
            loc,
            message,
            vscode.DiagnosticSeverity.Warning
          );
          diagnostics.push(diagnostic);
        }
      }
    };

    DomUtils.filter(
      (node: any) => node.type === 'tag',
      parsedDocument.children
    ).forEach((node) => {
      checkElement(
        node,
        'html',
        'lang',
        '[Refa11y] Define the natual language of your page by using the lang attribute on the <html> element'
      );
    });
  } catch (error) {
    console.error('Error parsing HTML: ', error);
  }

  return diagnostics;
}
