import * as vscode from 'vscode';
import { TSXDiagnosticGenerator } from './diagnostics/TSXDiagnosticGenerator';
import { HTMLDiagnosticGenerator } from './diagnostics/HTMLDiagnosticGenerator';

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
      const htmlDiagnostic = new HTMLDiagnosticGenerator(text, event.document);
      diagnostics.push(...htmlDiagnostic.generateDiagnostics());
    } else if (
      event.document.languageId === 'javascript' ||
      event.document.languageId === 'typescriptreact'
    ) {
      const generator = new TSXDiagnosticGenerator(text, event.document);
      diagnostics.push(...generator.generateDiagnostics());
    }

    diagnosticManager.updateDiagnostics(event.document, diagnostics);
  });
}

export function deactivate() {}
