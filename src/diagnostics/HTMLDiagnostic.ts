import * as vscode from 'vscode';
import { DomUtils, parseDocument } from 'htmlparser2';
import HtmlElement from './HtmlElement';
import { AnyNode } from 'domhandler';

export class HTMLDiagnostic {
  private diagnostics: vscode.Diagnostic[] = [];

  constructor(
    private text: string,
    private document: vscode.TextDocument,
    private elements: HtmlElement[] = [
      new HtmlElement('html', { attributes: ['lang'], unique: true }),
      new HtmlElement('title', { required: true, unique: true }),
      new HtmlElement('meta', { attributes: ['name'], required: true }),
      new HtmlElement('main', { unique: true }),
      new HtmlElement('nav', {
        specialCase: true,
        attributes: ['aria-labelledby', 'aria-label'],
      }),
    ]
  ) {}

  generateDiagnostics() {
    try {
      const parsedDocument = parseDocument(this.text);

      const nodes = DomUtils.filter(
        (node) => node.type === 'tag',
        parsedDocument.children
      );

      this.elements.forEach((element) => {
        element.validate(nodes);

        if (element.error) {
          this.diagnostics.push(
            this.getDiagnostic(element.warning, element.nodes[0])
          );
        }
      });
    } catch (error) {
      console.error('Error parsing HTML: ', error);
    }

    return this.diagnostics;
  }

  private getDiagnostic(message: string, node?: AnyNode): vscode.Diagnostic {
    const range =
      node && node.startIndex && node.endIndex
        ? new vscode.Range(
            this.document.positionAt(node.startIndex),
            this.document.positionAt(node.endIndex)
          )
        : new vscode.Range(
            new vscode.Position(0, 0),
            new vscode.Position(0, 0)
          );

    return new vscode.Diagnostic(
      range,
      message,
      vscode.DiagnosticSeverity.Warning
    );
  }
}
