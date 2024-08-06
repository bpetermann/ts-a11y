import * as vscode from 'vscode';
import { DomUtils, parseDocument } from 'htmlparser2';
import { warnings } from './warnings';

function getDiagnostic(
  node: any,
  document: vscode.TextDocument,
  message: string
) {
  const loc =
    node.startIndex && node.endIndex
      ? new vscode.Range(
          document.positionAt(node.startIndex),
          document.positionAt(node.endIndex)
        )
      : new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0));

  return new vscode.Diagnostic(loc, message, vscode.DiagnosticSeverity.Warning);
}

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
      if (
        node.name === elementName &&
        node.attribs &&
        !node.attribs[attributeName]
      ) {
        diagnostics.push(getDiagnostic(node, document, message));
      }
    };

    DomUtils.filter(
      (node) => node.type === 'tag',
      parsedDocument.children
    ).forEach((node) => checkElement(node, 'html', 'lang', warnings.html.lang));
  } catch (error) {
    console.error('Error parsing HTML: ', error);
  }

  return diagnostics;
}
