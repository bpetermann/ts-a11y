import * as vscode from 'vscode';
import { HTMLDiagnosticGenerator as DiagnosticGenerator } from './diagnostics/html/DiagnosticGenerator';
import { TSXDiagnosticGenerator } from './diagnostics/tsx/DiagnosticGenerator';
import { HTML, TYPESCRIPT_REACT } from './diagnostics/utils/constants';

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

    switch (event.document.languageId) {
      case HTML:
        const htmlGenerator = new DiagnosticGenerator(text, event.document);
        diagnostics.push(...htmlGenerator.generateDiagnostics());
        break;
      case TYPESCRIPT_REACT:
        const tsxGenerator = new TSXDiagnosticGenerator(text);
        diagnostics.push(...tsxGenerator.generateDiagnostics());
        break;
    }

    diagnosticManager.updateDiagnostics(event.document, diagnostics);
  });
}

export function deactivate() {}
