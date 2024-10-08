import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as jsx from '@babel/types';
import * as vscode from 'vscode';
import { TSXElement } from './Element';
import {
  ButtonValidator,
  DivValidator,
  ImageValidator,
  LinkValidator,
} from './validators';
import { Validator } from './validators/Validator';

export class TSXDiagnosticGenerator {
  private diagnostics: vscode.Diagnostic[] = [];

  constructor(
    private text: string,
    private validators: Validator[] = [
      new ButtonValidator(),
      new ImageValidator(),
      new DivValidator(),
      new LinkValidator(),
    ]
  ) {}

  /**
   * Generates diagnostics for the TSX code.
   */
  public generateDiagnostics(): vscode.Diagnostic[] {
    try {
      const ast = this.parseText();

      traverse(ast, {
        JSXElement: (path) => this.checkElement(path.node),
      });
    } catch (error) {
      console.error('Error parsing code: ', error);
    }

    return this.diagnostics;
  }

  /**
   * Checks a JSX element and adds diagnostics if issues are found.
   */
  private checkElement(node: jsx.JSXElement): void {
    const element = new TSXElement(node);
    const { name } = element;

    if (!name) {
      return;
    }

    const validator = this.findValidator(name);

    validator?.validate(element).forEach(({ diagnostic }) => {
      this.diagnostics.push(diagnostic);
    });
  }

  private findValidator(name: string) {
    return this.validators.find(({ tags }) => tags.includes(name));
  }

  /**
   * Parse the provided code as an entire program.
   */
  private parseText() {
    return parser.parse(this.text, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });
  }
}
