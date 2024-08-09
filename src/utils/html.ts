import * as vscode from 'vscode';
import { AnyNode } from 'domhandler';
import HTMLElement from '../diagnostics/element';

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

export function checkElements(
  document: vscode.TextDocument,
  domNodes: AnyNode[],
  elements: HTMLElement[]
): vscode.Diagnostic[] {
  return elements.reduce<vscode.Diagnostic[]>((diagnostics, element) => {
    element.validate(domNodes);

    if (element.error) {
      diagnostics.push(getDiagnostic(document, element.warning));
    }

    return diagnostics;
  }, []);
}
