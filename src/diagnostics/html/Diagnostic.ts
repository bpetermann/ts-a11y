import * as vscode from 'vscode';
import { DomUtils, parseDocument } from 'htmlparser2';
import HtmlElement from './Element';
import { AnyNode } from 'domhandler';
import { Constraint as C, Tag } from '../../types/html';

export class Diagnostic {
  private diagnostics: vscode.Diagnostic[] = [];

  constructor(
    private text: string,
    private document: vscode.TextDocument,
    private elements: HtmlElement[] = [
      new HtmlElement(Tag.Html, [C.Uniqueness, C.Attributes], ['lang']),
      new HtmlElement(Tag.Title, [C.Uniqueness, C.Required]),
      new HtmlElement(Tag.Meta, [C.Required, C.Attributes], ['name']),
      new HtmlElement(Tag.Main, [C.Uniqueness]),
      new HtmlElement(
        Tag.Nav,
        [C.Navigation],
        ['aria-labelledby', 'aria-label']
      ),
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
