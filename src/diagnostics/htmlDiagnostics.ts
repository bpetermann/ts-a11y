import * as vscode from 'vscode';
import { DomUtils, parseDocument } from 'htmlparser2';
import { warnings } from './warnings';
import { checkElementTags, checkElementsExists } from '../utils/html';

const requiredTags: {
  [element: string]: [attribute: string, warning: string];
} = {
  html: ['lang', warnings.html.lang],
};

const requiredElements: [string, string][] = [
  ['title', warnings.title.shouldExist],
];

export function getHtmlDiagnostics(
  text: string,
  document: vscode.TextDocument
): vscode.Diagnostic[] {
  const diagnostics: vscode.Diagnostic[] = [];

  try {
    const parsedDocument = parseDocument(text);

    const nodes = DomUtils.filter(
      (node) => node.type === 'tag',
      parsedDocument.children
    );

    const missingTags = checkElementTags(document, nodes, requiredTags);

    const missingElements = checkElementsExists(
      document,
      nodes,
      requiredElements
    );

    [...missingTags, ...missingElements].forEach((diagnostic) =>
      diagnostics.push(diagnostic)
    );
  } catch (error) {
    console.error('Error parsing HTML: ', error);
  }

  return diagnostics;
}
