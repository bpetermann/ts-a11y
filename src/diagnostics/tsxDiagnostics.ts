import * as vscode from 'vscode';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import { tsxWarning } from './warnings';
import {
  getElementNameString,
  hasAttribute,
  getDiagnostic,
} from '../utils/tsx';

export function getTsxDiagnostics(
  text: string,
  _document: vscode.TextDocument
): vscode.Diagnostic[] {
  const diagnostics: vscode.Diagnostic[] = [];

  try {
    const ast = parser.parse(text, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });

    traverse(ast, {
      JSXOpeningElement(path) {
        const { name, loc, attributes } = path.node;
        const elementNameString = getElementNameString(name);

        switch (elementNameString) {
          case 'button':
            if (!hasAttribute('aria-label', attributes) && loc) {
              diagnostics.push(
                getDiagnostic(loc, tsxWarning.button['aria-label'])
              );
            }
            break;
        }
      },
    });
  } catch (error) {
    console.error('Error parsing code: ', error);
  }

  return diagnostics;
}
