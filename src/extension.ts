import * as vscode from 'vscode';
import { HTMLDiagnostic } from './diagnostics/HtmlDiagnostics';
import { getTsxDiagnostics } from './diagnostics/TsxDiagnostics';
import HtmlElement from './diagnostics/HtmlElement';

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
      diagnostics.push(...new HTMLDiagnostic(text, event.document).diagnostics);
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
