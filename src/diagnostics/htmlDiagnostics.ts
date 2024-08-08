import * as vscode from 'vscode';
import { DomUtils, parseDocument } from 'htmlparser2';
import { warnings } from './warnings';
import { checkElementAttributes, checkElementsExists } from '../utils/html';

const requiredAttributes: {
  [element: string]: [attribute: string, warning: string];
} = {
  html: ['lang', warnings.html.lang],
};

const requiredElements: [
  element: string,
  attr: string | null,
  warning: string
][] = [
  ['title', null, warnings.title.shouldExist],
  ['meta', 'name', warnings.meta.shouldExist],
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

    const missingTags = checkElementAttributes(
      document,
      nodes,
      requiredAttributes
    );

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
