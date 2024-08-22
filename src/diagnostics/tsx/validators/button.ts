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
    if (!node.hasAttribute('aria-label')) {
      return [new Diagnostic(messages.button['aria-label'], node.loc)];
    }

    return [];
  }
}
