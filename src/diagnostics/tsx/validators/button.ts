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
    return [this.checkSwitchRole(node), this.checkTextContent(node)].filter(
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

  private checkTextContent(node: TSXElement): Diagnostic | undefined {
    const attributes = node.getAttributes();

    if (
      !node.text &&
      !node.getChild('img') &&
      !attributes.includes('aria-label') &&
      !attributes.includes('aria-labelledby') &&
      !attributes.includes('title')
    ) {
      return new Diagnostic(messages.button.text, node.loc);
    }
  }
}
