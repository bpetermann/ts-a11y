import { Element } from 'domhandler';
import * as vscode from 'vscode';
import { DiagnosticSeverity } from 'vscode';
import { ValidatorError } from './validators/Validator';

export class Diagnostic {
  #diagnostic: vscode.Diagnostic;
  private message: string;
  private node: Element | undefined;
  private severity: vscode.DiagnosticSeverity;

  constructor(
    private document: vscode.TextDocument,
    { message, node, severity }: ValidatorError
  ) {
    this.message = message;
    this.node = node;
    this.severity = severity ?? DiagnosticSeverity.Warning;

    this.#diagnostic = this.createDiagnostic();
  }

  get diagnostic(): vscode.Diagnostic {
    return this.#diagnostic;
  }

  /**
   * Creates a diagnostic object with a specific range, message, and severity.
   */
  private createDiagnostic(): vscode.Diagnostic {
    return new vscode.Diagnostic(
      this.getNodeRange(),
      this.message,
      this.severity
    );
  }

  /**
   * Gets the range of a node.
   */
  private getNodeRange(): vscode.Range {
    return this.node &&
      this.node.startIndex !== null &&
      this.node.endIndex !== null
      ? new vscode.Range(
          this.document.positionAt(this.node.startIndex),
          this.document.positionAt(this.node.endIndex)
        )
      : new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0));
  }
}
