import * as vscode from 'vscode';
import { DomUtils, parseDocument } from 'htmlparser2';
import { warnings } from './warnings';
import { checkElementsValid } from '../utils/html';

const elements: [tag: string, attr: string | null, warning: string][] = [
  ['html', 'lang', warnings.html.lang],
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

    checkElementsValid(document, nodes, elements).forEach((diagnostic) =>
      diagnostics.push(diagnostic)
    );
  } catch (error) {
    console.error('Error parsing HTML: ', error);
  }

  return diagnostics;
}
