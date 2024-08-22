import { messages } from '../messages';
import { Diagnostic } from '../diagnostic';
import { Validator } from './validator';
import { TSXElement } from '../element';

export class ButtonValidator implements Validator {
  #tags: string[] = ['button'] as const;

  get tags() {
    return this.#tags;
  }

  validate(node: TSXElement): Diagnostic[] {
    return [this.checkSwitchRole(node)].filter(
      (error) => error instanceof Diagnostic
    );
  }

  checkSwitchRole(node: TSXElement): Diagnostic | undefined {
    if (
      node.getAttribute('role') === 'switch' &&
      !node.hasAttribute('aria-checked')
    ) {
      return new Diagnostic(messages.button.switch, node.loc);
    }
  }
}
