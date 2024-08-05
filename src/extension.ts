import * as vscode from 'vscode';
import { getHtmlDiagnostics } from './diagnostics/htmlDiagnostics';

export function activate(context: vscode.ExtensionContext) {
  const diagnosticCollection =
    vscode.languages.createDiagnosticCollection('accessibility');

  context.subscriptions.push(
    vscode.commands.registerCommand('refa11y.helloWorld', () => {
      vscode.window.showInformationMessage('Hello World!');
    })
  );

  vscode.workspace.onDidChangeTextDocument((event) => {
    const diagnostics: vscode.Diagnostic[] = [];
    const text = event.document.getText();

    if (event.document.languageId === 'html') {
      diagnostics.push(...getHtmlDiagnostics(text, event.document));
    }

    diagnosticCollection.set(event.document.uri, diagnostics);
  });
}

export function deactivate() {}
