import { AnyNode, Document } from 'domhandler';
import { DomUtils, parseDocument } from 'htmlparser2';
import * as vscode from 'vscode';
import {
  AttributesValidator,
  HeadingValidator,
  LinkValidator,
  NavigationValidator,
  RequiredValidator,
  UniquenessValidator,
  Validator,
} from './validator';
import { DiagnosticSeverity } from 'vscode';

export class Diagnostic {
  private diagnostics: vscode.Diagnostic[] = [];

  constructor(
    private text: string,
    private document: vscode.TextDocument,

    private validators: Validator[] = [
      new AttributesValidator(),
      new RequiredValidator(),
      new UniquenessValidator(),
      new NavigationValidator(),
      new HeadingValidator(),
      new LinkValidator(),
    ]
  ) {}

  generateDiagnostics() {
    try {
      const parsedDocument = this.getDocument();
      const nodes = this.getNodes(parsedDocument);

      this.validators.forEach((validator) => {
        const errors = validator.validate(nodes);

        errors.forEach(({ message, node, severity }) =>
          this.diagnostics.push(this.getDiagnostic(message, node, severity))
        );
      });
    } catch (error) {
      console.error('Error parsing HTML: ', error);
    }

    return this.diagnostics;
  }

  private getDocument() {
    return parseDocument(this.text, {
      withStartIndices: true,
      withEndIndices: true,
    });
  }

  private getNodes(parsedDocument: Document) {
    return DomUtils.filter(
      (node) => node.type === 'tag',
      parsedDocument.children
    );
  }

  private getDiagnostic(
    message: string,
    node: AnyNode | undefined,
    severity: DiagnosticSeverity
  ): vscode.Diagnostic {
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
      severity ?? vscode.DiagnosticSeverity.Warning
    );
  }
}
