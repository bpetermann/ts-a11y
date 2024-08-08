import * as vscode from 'vscode';
import { DomUtils, parseDocument } from 'htmlparser2';
import { warnings } from './warnings';
import { Element, checkElementsValid } from '../utils/html';

const elements: Element[] = [
  {
    tag: 'html',
    required: true,
    attributes: ['lang'],
    unique: false,
    warning: warnings.html.lang,
  },
  {
    tag: 'title',
    required: true,
    attributes: [],
    unique: true,
    warning: warnings.title.shouldExist,
  },
  {
    tag: 'meta',
    required: true,
    attributes: ['name'],
    unique: false,
    warning: warnings.meta.shouldExist,
  },
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
