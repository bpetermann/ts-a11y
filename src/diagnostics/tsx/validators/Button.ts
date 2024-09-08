import { messages } from '../../utils/messages';
import { Diagnostic } from '../Diagnostic';
import { Validator } from './Validator';
import { TSXElement } from '../Element';

export class ButtonValidator implements Validator {
  #tags: string[] = ['button'] as const;

  get tags() {
    return this.#tags;
  }

  validate(node: TSXElement): Diagnostic[] {
    return [
      this.checkSwitchRole(node),
      this.checkTextContent(node),
      this.checkAbsractRole(node),
    ].filter((error) => error instanceof Diagnostic);
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

  private checkAbsractRole(node: TSXElement): Diagnostic | undefined {
    const abstractRole = node.getAbstractRole();
    if (abstractRole) {
      return new Diagnostic(messages.button.abstract + abstractRole, node.loc);
    }
  }
}
