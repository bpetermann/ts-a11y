# Zugang ![Version](https://img.shields.io/visual-studio-marketplace/v/bpetermann.zugang) <img src="https://img.shields.io/badge/LICENSE-MIT-green"  />

Zugang is a VS Code extension designed to help improve the accessibility of your HTML code. By providing warnings and suggestions, it guides you toward meeting accessibility standards in a structured and intuitive way.

## Overview of the Extension Features

Currently, Zugang offers warnings and hints when your HTML lacks essential elements, tags, or attributes that are necessary for proper accessibility. The extension focuses on common mistakes such as:

- Missing or incorrect accessibility-related attributes (e.g., `lang` on html, `aria-label` when multiple `nav` elements are present).
- Ignoring proper heading hierarchy (e.g., `h1 -> h2 -> h3`...).
- Omitting essential meta elements (e.g., viewport settings).

Each warning is accompanied by specific suggestions for improvement, helping you understand the issue and make the necessary corrections.

> [!NOTE]  
> The warnings provided are based on general best practices. However, in real-world scenarios, there may be valid reasons to deviate from these rules depending on the specific context. A general extension cannot always account for these variations.
>
> Additionally, the actual accessibility of a particular element is often influenced by the complex interplay of HTML, CSS, and JavaScript.

## Future Features

Expansion to support `.tsx` files, ensuring accessibility best practices are maintained in React/TypeScript projects as well.

## Installation

To install the extension:

1. Open the Extensions view in VS Code.
2. Search for `Zugang` in the marketplace.
3. Install the extension from the search results.

## Version

The current version is a **pre-release** version. Expect frequent updates as new features and improvements are implemented.

## Usage Examples

![simplescreenrecorder-2024-08-15_23 16 27-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/8be37fc9-c96a-45ef-aaf4-bb4e93ea1b1a)

## Inspiration

This project drew inspiration from Manuel Matuzović's excellent book, [“Web Accessibility Cookbook”](https://www.oreilly.com/library/view/web-accessibility-cookbook/9781098145590/), a lecture by [chrcit](https://github.com/chrcit), and Mary Sutton's courses on [Frontend Masters](https://frontendmasters.com/courses/react-accessibility/introduction/)

## Contributing

Create a branch on your fork, add commits to your fork, and open a pull request from your fork to this repository.

## Changelog

To check full changelog click [here](https://github.com/bpetermann/vscode-zugang/blob/main/CHANGELOG.md)

## License

[MIT](https://github.com/bpetermann/vscode-zugang/blob/main/LICENSE)
