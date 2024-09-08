import { DomUtils, parseDocument } from 'htmlparser2';
import NodeOrganizer from '../diagnostics/html/NodeOrganizer';
import * as vscode from 'vscode';

/** Logs all diagnostics messages */
export const logDiagnostics = (diagnostics: vscode.Diagnostic[]) => {
  console.log(
    'All diagnostic messages: ',
    diagnostics.map(({ message }) => message)
  );
};

/** HTML*/

export const meta =
  "<meta name='viewport' content='width=device-width, initial-scale=1.0' />";

export const html = (children: string) => `<html lang="en">${children}</html>`;

export const head = (children: string) => `<head>${children}</head>`;

export const body = (children?: string) => `<body>${children}</body>`;

export const link = (children?: string) => `<a href="/blog">${children}</a>`;

export const div = (children: string | null, ...args: string[]) =>
  `<div ${args}>${children}</div>`;

export const title = '<title>Document</title>';

export const fraction = (...args: string[]) => `<>${args}</>`;

/** Creates an html document based on a string. */
export const getDocument = (html: string) =>
  vscode.workspace.openTextDocument({
    content: html,
    language: 'html',
  });

/** Get the dom nodes from a tex */
export const getDomNodes = (text: string) => {
  return DomUtils.filter(
    (node) => node.type === 'tag',
    parseDocument(text, {
      withStartIndices: true,
      withEndIndices: true,
    }).children
  );
};

/** Instantiates and returns a NodeOrganize */
export const getOrganizedNodes = (document: vscode.TextDocument) => {
  return new NodeOrganizer(getDomNodes(document.getText()));
};
