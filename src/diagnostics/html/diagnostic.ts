import { AnyNode, Document } from 'domhandler';
import { DomUtils, parseDocument } from 'htmlparser2';
import * as vscode from 'vscode';
import {
  AttributesValidator,
  DivValidator,
  HeadingValidator,
  LinkValidator,
  NavigationValidator,
  RequiredValidator,
  UniquenessValidator,
  Validator,
} from './validator';
import { DiagnosticSeverity } from 'vscode';
import NodeOrganizer from './organizer';

export class Diagnostic {
  private diagnostics: vscode.Diagnostic[] = [];

  constructor(
    private htmlContent: string,
    private document: vscode.TextDocument,
    private validators: Validator[] = [
      new AttributesValidator(),
      new RequiredValidator(),
      new UniquenessValidator(),
      new NavigationValidator(),
      new HeadingValidator(),
      new LinkValidator(),
      new DivValidator(),
    ]
  ) {}

  /**
   * Generates and returns all diagnostics after running the validation process
   */
  generateDiagnostics() {
    try {
      const parsedHtml = this.parseHtmlDocument();
      const nodeOrganizer = this.organizeNodes(parsedHtml);
      this.runValidators(nodeOrganizer);
    } catch (error) {
      console.error('Error parsing HTML: ', error);
    }

    return this.diagnostics;
  }

  /**
   * Runs the validators against the organized nodes and collects diagnostics
   */
  private runValidators(nodeOrganizer: NodeOrganizer) {
    this.validators.forEach((validator) => {
      const nodes = nodeOrganizer.getNodes(validator.nodeTags);

      validator
        .validate(nodes)
        .forEach(({ message, node, severity }) =>
          this.diagnostics.push(this.createDiagnostic(message, node, severity))
        );
    });
  }

  /**
   * Parses the HTML content into a document object
   */
  private parseHtmlDocument() {
    return parseDocument(this.htmlContent, {
      withStartIndices: true,
      withEndIndices: true,
    });
  }

  /**
   * Organizes the nodes into a structure accessible by tag name
   */
  private organizeNodes(parsedHtml: Document) {
    const tagNodes = DomUtils.filter(
      (node) => node.type === 'tag',
      parsedHtml.children
    );
    return new NodeOrganizer(tagNodes);
  }

  /**
   * Creates a diagnostic object with a specific range, message, and severity
   */
  private createDiagnostic(
    message: string,
    node: AnyNode | undefined,
    severity: DiagnosticSeverity
  ): vscode.Diagnostic {
    return new vscode.Diagnostic(this.getNodeRange(node), message, severity);
  }

  /**
   * Gets the range of a node
   */
  private getNodeRange(node: AnyNode | undefined) {
    return node && node.startIndex && node.endIndex
      ? new vscode.Range(
          this.document.positionAt(node.startIndex),
          this.document.positionAt(node.endIndex)
        )
      : new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0));
  }
}
