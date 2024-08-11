import * as vscode from 'vscode';
import { DomUtils, parseDocument } from 'htmlparser2';
import HtmlElement from './Element';
import { AnyNode } from 'domhandler';
import { Constraint, Tag } from '../../types/html';

export class Diagnostic {
  private diagnostics: vscode.Diagnostic[] = [];

  constructor(
    private text: string,
    private document: vscode.TextDocument,
    // prettier-ignore
    private elements: HtmlElement[] = [
      new HtmlElement(Tag.Html, [Constraint.Uniqueness, Constraint.Attributes], ['lang']),
      new HtmlElement(Tag.Title, [Constraint.Uniqueness, Constraint.Required]),
      new HtmlElement(Tag.Meta, [Constraint.Required, Constraint.Attributes], ['name']),
      new HtmlElement(Tag.Main, [Constraint.Uniqueness]),
      new HtmlElement(Tag.H1, [Constraint.Uniqueness]),
      new HtmlElement(Tag.H2, [Constraint.Heading]),
      new HtmlElement(Tag.H3, [Constraint.Heading]),
      new HtmlElement(Tag.H4, [Constraint.Heading]),
      new HtmlElement(Tag.H5, [Constraint.Heading]),
      new HtmlElement(Tag.H6, [Constraint.Heading]),
      new HtmlElement(Tag.Nav, [Constraint.Navigation], ['aria-labelledby', 'aria-label'])]
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
            this.getDiagnostic(element.warning, element.getFirstNode())
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
