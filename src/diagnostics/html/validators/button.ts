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

    return this.getErrors(buttons, getNodeAttributes);
  }

  private getErrors(
    buttons: AnyNode[],
    getNodeAttributes: (node: AnyNode) => { [name: string]: string } | {}
  ): ValidatorError[] {
    const errors: (ValidatorError | undefined)[] = [];

    buttons.forEach((button) => {
      const attributes = getNodeAttributes(button);

      if (Object.keys(attributes).length) {
        errors.push(this.getTabIndexError(button, attributes));
        errors.push(this.getDisabledError(button, attributes));
        errors.push(this.getSwitchError(button, attributes));
      }
    });

    return errors.filter((error) => error instanceof ValidatorError);
  }

  private getTabIndexError(
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

  private getSwitchError(
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

  private getDisabledError(
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
}
