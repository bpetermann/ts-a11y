import * as vscode from 'vscode';
import { AnyNode } from 'domhandler';

export function getDiagnostic(
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

function findDomElement(name: string, nodes: AnyNode[]) {
  return nodes.find((node) => node && 'name' in node && node.name === name);
}

export function checkElementsExists(
  document: vscode.TextDocument,
  domNodes: AnyNode[],
  elements: [name: string, warning: string][]
): vscode.Diagnostic[] {
  return elements
    .map(([name, warning]) => {
      return !findDomElement(name, domNodes)
        ? getDiagnostic({}, document, warning)
        : null;
    })
    .filter((item) => item !== null);
}

export function checkElementTags(
  document: vscode.TextDocument,
  domNodes: AnyNode[],
  elements: { [element: string]: [attribute: string, warning: string] }
) {
  return domNodes
    .map((node) => {
      return 'name' in node &&
        'attribs' in node &&
        node.name in elements &&
        !node.attribs[elements[node.name][0]]
        ? getDiagnostic(node, document, elements[node.name][1])
        : null;
    })
    .filter((item) => item !== null);
}
