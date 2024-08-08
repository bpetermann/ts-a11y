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

function findElementsByName(tag: string, domNodes: AnyNode[]): AnyNode[] {
  return domNodes.filter((node) => node && 'name' in node && node.name === tag);
}

function hasAttribute(nodes: AnyNode[], attr: string): boolean {
  return nodes.some((node) => 'attribs' in node && node.attribs[attr]);
}

export function checkElementsValid(
  document: vscode.TextDocument,
  domNodes: AnyNode[],
  elements: [tag: string, attr: string | null, warning: string][]
): vscode.Diagnostic[] {
  return elements.reduce<vscode.Diagnostic[]>(
    (diagnostics, [tag, attr, warning]) => {
      const matchingElements = findElementsByName(tag, domNodes);
      const attributeExists = attr
        ? hasAttribute(matchingElements, attr)
        : true;

      if (!matchingElements.length || !attributeExists) {
        diagnostics.push(getDiagnostic(document, warning));
      }

      return diagnostics;
    },
    []
  );
}
