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
    return [this.checkSequenceLength(node)].filter(
      (error) => error instanceof Diagnostic
    );
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
}
