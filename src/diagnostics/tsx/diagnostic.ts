import * as vscode from 'vscode';
import { DiagnosticSeverity } from 'vscode';
import * as jsx from '@babel/types';

export class Diagnostic {
  #diagnostic: vscode.Diagnostic;

  constructor(
    private message: string,
    private location?: jsx.SourceLocation | null,
    private severity: vscode.DiagnosticSeverity = DiagnosticSeverity.Warning
  ) {
    this.#diagnostic = this.createDiagnostic();
  }

  get diagnostic(): vscode.Diagnostic {
    return this.#diagnostic;
  }

  /**
   * Creates a diagnostic object with a specific range, message, and severity
   */
  private createDiagnostic(): vscode.Diagnostic {
    return new vscode.Diagnostic(this.getRange(), this.message, this.severity);
  }

  /**
   * Gets the range of a location
   */
  private getRange(): vscode.Range {
    return this.location?.start && this.location?.end
      ? this.getLocationRange()
      : new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0));
  }

  private getLocationRange(): vscode.Range {
    return new vscode.Range(
      new vscode.Position(
        this.location!.start.line - 1,
        this.location!.start.column
      ),
      new vscode.Position(
        this.location!.end.line - 1,
        this.location!.end.column
      )
    );
  }
}
