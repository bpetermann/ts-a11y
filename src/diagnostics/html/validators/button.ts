import { AnyNode, Element } from 'domhandler';
import { messages } from '../messages';
import { DiagnosticSeverity } from 'vscode';
import { Validator, ValidatorError } from './validator';
import ElementList from '../elements';

export class ButtonValidator implements Validator {
  readonly #nodeTags = ['button'] as const;

  get nodeTags() {
    return this.#nodeTags;
  }

  validate(nodes: AnyNode[]): ValidatorError[] {
    const { elements: buttons, getElementAttributes } = new ElementList(
      nodes,
      'button'
    );

    if (!buttons.length) {
      return [];
    }

    return this.runChecks(buttons, getElementAttributes);
  }

  private runChecks(
    buttons: Element[],
    getElementAttributes: (element: Element) => { [name: string]: string }
  ): ValidatorError[] {
    const errors: (ValidatorError | undefined)[] = [];

    buttons.forEach((button) => {
      const attributes = getElementAttributes(button);

      if (Object.keys(attributes).length) {
        errors.push(this.checkTabIndex(button, attributes));
        errors.push(this.checkDeactivation(button, attributes));
        errors.push(this.checkSwitchRole(button, attributes));
      }
    });

    return errors.filter((error) => error instanceof ValidatorError);
  }

  private checkTabIndex(
    button: Element,
    attributes: { [name: string]: string }
  ): ValidatorError | undefined {
    const tab = 'tabindex' as const;
    if (tab in attributes && +attributes[tab] > 0) {
      return new ValidatorError(
        messages.button[tab],
        button,
        DiagnosticSeverity.Hint
      );
    }
  }

  private checkDeactivation(
    button: Element,
    attributes: { [name: string]: string }
  ): ValidatorError | undefined {
    if ('disabled' in attributes) {
      return new ValidatorError(
        messages.button.disabled,
        button,
        DiagnosticSeverity.Warning
      );
    }
  }

  private checkSwitchRole(
    button: Element,
    attributes: { [name: string]: string }
  ): ValidatorError | undefined {
    if (attributes?.['role'] === 'switch' && !('aria-checked' in attributes)) {
      return new ValidatorError(
        messages.button.switchRole,
        button,
        DiagnosticSeverity.Hint
      );
    }
  }
}
