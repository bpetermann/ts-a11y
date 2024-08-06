import * as vscode from 'vscode';
import { DomUtils, parseDocument } from 'htmlparser2';
import { warnings } from './warnings';
import { AnyNode } from 'domhandler';

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

function findDomElement(name: string, nodes: AnyNode[]) {
  return nodes.find((node) => node && 'name' in node && node.name === name);
}

function checkElementsExists(
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

function checkElement(
  node: any,
  attributeName: string,
  message: string,
  document: vscode.TextDocument
) {
  return node.attribs && !node.attribs[attributeName]
    ? getDiagnostic(node, document, message)
    : null;
}

function checkElementTags(
  document: vscode.TextDocument,
  domNodes: AnyNode[],
  elements: { [element: string]: [attribute: string, warning: string] }
) {
  return domNodes
    .map((node) => {
      return 'name' in node && node.name in elements
        ? checkElement(
            node,
            elements[node.name][0],
            elements[node.name][1],
            document
          )
        : null;
    })
    .filter((item) => item !== null);
}

export function getHtmlDiagnostics(
  text: string,
  document: vscode.TextDocument
): vscode.Diagnostic[] {
  const diagnostics: vscode.Diagnostic[] = [];

  try {
    const parsedDocument = parseDocument(text);

    const domNodes = DomUtils.filter(
      (node) => node.type === 'tag',
      parsedDocument.children
    );

    const missingTags = checkElementTags(document, domNodes, {
      html: ['lang', warnings.html.lang],
    });

    const missingElements = checkElementsExists(document, domNodes, [
      ['title', warnings.title.shouldExist],
    ]);

    [...missingTags, ...missingElements].forEach((diagnostic) =>
      diagnostics.push(diagnostic)
    );
  } catch (error) {
    console.error('Error parsing HTML: ', error);
  }

  return diagnostics;
}
