export const meta =
  "<meta name='viewport' content='width=device-width, initial-scale=1.0' />";

export const html = (el: string) => `<html lang="en">${el}</html>`;

export const head = (el: string) => `<head>${el}</head>`;

export const body = (el?: string) => `<body>${el}</body>`;

export const link = (el?: string) => `<a href="/blog">${el}</a>`;

export const div = (el?: string) => `<div>${el}</div>`;

export const title = '<title>Document</title>';
