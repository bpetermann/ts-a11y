import * as vscode from 'vscode';
import { DomUtils, parseDocument } from 'htmlparser2';
import { checkElements } from '../utils/html';
import Element from './element';

const elements = [
  new Element('html', true, ['lang'], false),
  new Element('title', true, [], true),
  new Element('meta', true, ['name'], false),
  new Element('main', false, [], true),
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

    checkElements(document, nodes, elements).forEach((diagnostic) =>
      diagnostics.push(diagnostic)
    );
  } catch (error) {
    console.error('Error parsing HTML: ', error);
  }

  return diagnostics;
}
