import * as vscode from 'vscode';

/** Logs all diagnostics messages */
export const logDiagnostics = (diagnostics: vscode.Diagnostic[]) => {
  console.log(
    'All diagnostic messages: ',
    diagnostics.map(({ message }) => message)
  );
};

export const div = (children: string | null, ...args: string[]) =>
  `<div ${args}>${children}</div>`;

export const fraction = (...args: string[]) => `<>${args}</>`;

/** Creates an html document based on a string. */
export const getDocument = (html: string) =>
  vscode.workspace.openTextDocument({
    content: html,
    language: 'html',
  });
