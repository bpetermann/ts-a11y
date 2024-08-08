import * as vscode from 'vscode';
import { AnyNode } from 'domhandler';

function getRange(document: vscode.TextDocument, node?: AnyNode) {
  return node && node.startIndex && node.endIndex
    ? new vscode.Range(
        document.positionAt(node.startIndex),
        document.positionAt(node.endIndex)
      )
    : new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0));
}

export function getDiagnostic(
  document: vscode.TextDocument,
  message: string,
  node?: AnyNode
) {
  return new vscode.Diagnostic(
    getRange(document, node),
    message,
    vscode.DiagnosticSeverity.Warning
  );
}

function findTag(name: string, domNodes: AnyNode[]): AnyNode[] {
  return domNodes.filter(
    (node) => node && 'name' in node && node.name === name
  );
}

function findAttributeOnElement(
  name: string,
  domNodes: AnyNode[],
  attr: string
): AnyNode | undefined {
  return findTag(name, domNodes)?.find(
    (node) => 'attribs' in node && node.attribs[attr]
  );
}

export function checkElementsExists(
  document: vscode.TextDocument,
  domNodes: AnyNode[],
  elements: [tag: string, attr: string | null, warning: string][]
): vscode.Diagnostic[] {
  return elements
    .map(([tag, attr, warning]) => {
      const validElement =
        findTag(tag, domNodes).length &&
        (!attr || (attr && findAttributeOnElement(tag, domNodes, attr)));

      return !validElement ? getDiagnostic(document, warning) : null;
    })
    .filter((item) => item !== null);
}

export function checkElementAttributes(
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
        ? getDiagnostic(document, elements[node.name][1], node)
        : null;
    })
    .filter((item) => item !== null);
}
