import { AnyNode } from 'domhandler';
import { messages } from '../messages';
import NodeList from '../nodelist';
import { DiagnosticSeverity } from 'vscode';
import { Validator, ValidatorError } from './validator';

export class ButtonValidator implements Validator {
  readonly #nodeTags = ['button'] as const;

  get nodeTags() {
    return this.#nodeTags;
  }

  validate(nodes: AnyNode[]): ValidatorError[] {
    const { nodes: buttons, getNodeAttributes } = new NodeList(nodes, 'button');

    if (!buttons.length) {
      return [];
    }

    return this.runChecks(buttons, getNodeAttributes);
  }

  private runChecks(
    buttons: AnyNode[],
    getNodeAttributes: (node: AnyNode) => { [name: string]: string } | {}
  ): ValidatorError[] {
    const errors: (ValidatorError | undefined)[] = [];

    buttons.forEach((button) => {
      const attributes = getNodeAttributes(button);

      if (Object.keys(attributes).length) {
        errors.push(this.checkTabIndex(button, attributes));
        errors.push(this.checkDeactivation(button, attributes));
        errors.push(this.checkSwitchRole(button, attributes));
      }
    });

    return errors.filter((error) => error instanceof ValidatorError);
  }

  private checkTabIndex(
    button: AnyNode,
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
    button: AnyNode,
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
    button: AnyNode,
    attributes: { [name: string]: string }
  ): ValidatorError | undefined {
    if (
      'role' in attributes &&
      attributes['role'] === 'switch' &&
      !('aria-checked' in attributes)
    ) {
      return new ValidatorError(
        messages.button.switchRole,
        button,
        DiagnosticSeverity.Hint
      );
    }
  }
}
