import * as vscode from 'vscode';
import { TSXDiagnostic } from './diagnostics/tsx/TSXDiagnostic';
import { Diagnostic as HTMLDiagnostic } from './diagnostics/html/Diagnostic';

class DiagnosticManager {
  private diagnosticCollection: vscode.DiagnosticCollection;

  constructor(context: vscode.ExtensionContext) {
    this.diagnosticCollection =
      vscode.languages.createDiagnosticCollection('accessibility');
    context.subscriptions.push(this.diagnosticCollection);
  }

  updateDiagnostics(
    document: vscode.TextDocument,
    diagnostics: vscode.Diagnostic[]
  ) {
    this.diagnosticCollection.set(document.uri, diagnostics);
  }
}

export function activate(context: vscode.ExtensionContext) {
  const diagnosticManager = new DiagnosticManager(context);

  vscode.workspace.onDidChangeTextDocument((event) => {
    const diagnostics: vscode.Diagnostic[] = [];
    const text = event.document.getText();

    if (event.document.languageId === 'html') {
      const htmlDiagnostic = new HTMLDiagnostic(text, event.document);
      diagnostics.push(...htmlDiagnostic.generateDiagnostics());
    } else if (
      event.document.languageId === 'javascript' ||
      event.document.languageId === 'typescriptreact'
    ) {
      const generator = new TSXDiagnostic(text, event.document);
      diagnostics.push(...generator.generateDiagnostics());
    }

    diagnosticManager.updateDiagnostics(event.document, diagnostics);
  });
}

export function deactivate() {}
