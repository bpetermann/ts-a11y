import * as vscode from 'vscode';
import { AnyNode } from 'domhandler';

export interface Element {
  tag: string;
  required: boolean;
  attributes: string[];
  unique: boolean;
  warning: string;
}

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

function findElementsByTag(tag: string, domNodes: AnyNode[]): AnyNode[] {
  return domNodes.filter((node) => node && 'name' in node && node.name === tag);
}

function hasAttribute(nodes: AnyNode[], attr: string): boolean {
  return nodes.some((node) => 'attribs' in node && node.attribs[attr]);
}

export function checkElementsValid(
  document: vscode.TextDocument,
  domNodes: AnyNode[],
  elements: Element[]
): vscode.Diagnostic[] {
  return elements.reduce<vscode.Diagnostic[]>(
    (diagnostics, { attributes, tag, warning }) => {
      const matchingElements = findElementsByTag(tag, domNodes);
      const attributeExists = attributes.length
        ? attributes.every((attr) => hasAttribute(matchingElements, attr))
        : true;

      if (!matchingElements.length || !attributeExists) {
        diagnostics.push(getDiagnostic(document, warning));
      }

      return diagnostics;
    },
    []
  );
}
