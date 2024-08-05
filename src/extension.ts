import * as vscode from 'vscode';
import { getHtmlDiagnostics } from './diagnostics/htmlDiagnostics';
import { getTsxDiagnostics } from './diagnostics/tsxDiagnostics';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('refa11y.helloWorld', () => {
      vscode.window.showInformationMessage('Hello World!');
    })
  );

  const diagnosticCollection =
    vscode.languages.createDiagnosticCollection('accessibility');

  vscode.workspace.onDidChangeTextDocument((event) => {
    const diagnostics: vscode.Diagnostic[] = [];

    const text = event.document.getText();

    if (event.document.languageId === 'html') {
      diagnostics.push(...getHtmlDiagnostics(text, event.document));
    } else if (
      event.document.languageId === 'javascript' ||
      event.document.languageId === 'typescriptreact'
    ) {
      diagnostics.push(...getTsxDiagnostics(text, event.document));
    }

    diagnosticCollection.set(event.document.uri, diagnostics);
  });
}

export function deactivate() {}
