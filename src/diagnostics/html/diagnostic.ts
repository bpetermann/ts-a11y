import { AnyNode } from 'domhandler';
import { DomUtils, parseDocument } from 'htmlparser2';
import * as vscode from 'vscode';
import {
  AttributesValidator,
  HeadingValidator,
  NavigationValidator,
  RequiredValidator,
  UniquenessValidator,
  Validator,
} from './validator';

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
    ]
  ) {}

  generateDiagnostics() {
    try {
      const parsedDocument = parseDocument(this.text);

      const nodes = DomUtils.filter(
        (node) => node.type === 'tag',
        parsedDocument.children
      );

      this.validators.forEach((validator) => {
        validator
          .validate(nodes)
          .forEach((error) => this.diagnostics.push(this.getDiagnostic(error)));
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
