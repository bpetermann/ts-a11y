import { DomUtils, parseDocument } from 'htmlparser2';
import NodeOrganizer from '../diagnostics/html/organizer';
import * as vscode from 'vscode';

export const meta =
  "<meta name='viewport' content='width=device-width, initial-scale=1.0' />";

export const html = (el: string) => `<html lang="en">${el}</html>`;

export const head = (el: string) => `<head>${el}</head>`;

export const body = (el?: string) => `<body>${el}</body>`;

export const link = (el?: string) => `<a href="/blog">${el}</a>`;

export const div = (el?: string) => `<div>${el}</div>`;

export const title = '<title>Document</title>';

/**
 * Creates an html document based on a string.
 */
export const getDocument = (html: string) =>
  vscode.workspace.openTextDocument({
    content: html,
    language: 'html',
  });

/**
 * Get the dom nodes from a text
 */
export const getDomNodes = (text: string) => {
  return DomUtils.filter(
    (node) => node.type === 'tag',
    parseDocument(text, {
      withStartIndices: true,
      withEndIndices: true,
    }).children
  );
};

/**
 * Instantiates and returns a NodeOrganizer
 */
export const getOrganizedNodes = (document: vscode.TextDocument) => {
  return new NodeOrganizer(getDomNodes(document.getText()));
};

/**
 * Logs all diagnostics messages
 */
export const logDiagnostics = (diagnostics: vscode.Diagnostic[]) => {
  console.log(
    'All diagnostic messages: ',
    diagnostics.map(({ message }) => message)
  );
};
