import { messages } from '../messages';
import { Diagnostic } from '../diagnostic';
import { Validator } from './validator';
import { TSXElement } from '../element';
import { DiagnosticSeverity } from 'vscode';

export class DivValidator implements Validator {
  #tags: string[] = ['div'] as const;
  private maxSequenceLength: number = 5;

  get tags() {
    return this.#tags;
  }

  validate(node: TSXElement): Diagnostic[] {
    return [
      this.checkSequenceLength(node),
      this.checkButtonRole(node),
      this.checkWrongAttibutes(node),
    ].filter((error) => error instanceof Diagnostic);
  }

  private checkSequenceLength(node: TSXElement): Diagnostic | undefined {
    if (node.getSeuqenceLength() >= this.maxSequenceLength) {
      return new Diagnostic(
        messages.div.soup,
        node.loc,
        DiagnosticSeverity.Information
      );
    }
  }

  private checkButtonRole(node: TSXElement): Diagnostic | undefined {
    if (
      node.getAttributes().includes('onclick') ||
      node.getAttribute('role') === 'button'
    ) {
      return new Diagnostic(
        messages.div.button,
        node.loc,
        DiagnosticSeverity.Information
      );
    }
  }

  private checkWrongAttibutes(node: TSXElement): Diagnostic | undefined {
    if (node.getAttribute('aria-expanded') !== undefined) {
      return new Diagnostic(
        messages.div.expanded,
        node.loc,
        DiagnosticSeverity.Hint
      );
    }
  }
}
