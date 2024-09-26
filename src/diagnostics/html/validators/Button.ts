import { AnyNode, Element, Text } from 'domhandler';
import { DiagnosticSeverity } from 'vscode';
import {
  ARIA_CHECKED,
  ARIA_LABEL,
  ARIA_LABELLEDBY,
  BUTTON,
  DISABLED,
  IMG,
  ROLE,
  SWITCH,
  TABINDEX,
  TITLE,
} from '../../utils/constants';
import { messages } from '../../utils/messages';
import { HTMLElement } from '../Element';
import ElementList from '../ElementList';
import { Validator, ValidatorError } from './Validator';

export class ButtonValidator implements Validator {
  readonly #nodeTags = [BUTTON];

  get nodeTags() {
    return this.#nodeTags;
  }

  validate(nodes: AnyNode[]): ValidatorError[] {
    const { elements: buttons } = new ElementList(nodes, BUTTON);

    if (!buttons.length) {
      return [];
    }

    return this.runChecks(buttons);
  }

  private runChecks(buttons: Element[]): ValidatorError[] {
    const errors: (ValidatorError | undefined)[] = [];

    buttons.forEach((button) => {
      const attributes = button.attribs;

      errors.push(this.checkTabIndex(button, attributes));
      errors.push(this.checkDeactivation(button, attributes));
      errors.push(this.checkSwitchRole(button, attributes));
      errors.push(this.checkTextContent(button, attributes));
      errors.push(this.checkAbsractRole(button, attributes));
    });

    return errors.filter((error) => error instanceof ValidatorError);
  }

  private checkTabIndex(
    button: Element,
    attributes: { [name: string]: string }
  ): ValidatorError | undefined {
    if (TABINDEX in attributes && +attributes[TABINDEX] > 0) {
      return new ValidatorError(
        messages.button[TABINDEX],
        button,
        DiagnosticSeverity.Hint
      );
    }
  }

  private checkDeactivation(
    button: Element,
    attributes: { [name: string]: string }
  ): ValidatorError | undefined {
    if (DISABLED in attributes) {
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
    if (attributes?.[ROLE] === SWITCH && !(ARIA_CHECKED in attributes)) {
      return new ValidatorError(
        messages.button.switch,
        button,
        DiagnosticSeverity.Hint
      );
    }
  }

  private checkTextContent(
    button: Element,
    attributes: { [name: string]: string }
  ) {
    const hasTextChild = button.children.find((child) => child instanceof Text);
    const hasImgChild = button.children.find(
      (child) => child instanceof Element && child.name === IMG
    );

    if (
      !hasTextChild &&
      !hasImgChild &&
      !(ARIA_LABEL in attributes) &&
      !(ARIA_LABELLEDBY in attributes) &&
      !(TITLE in attributes)
    ) {
      return new ValidatorError(messages.button.text, button);
    }
  }

  private checkAbsractRole(
    button: Element,
    attributes: { [name: string]: string }
  ) {
    if (ROLE in attributes && HTMLElement.getAbsractRole(button)) {
      return new ValidatorError(messages.button.abstract, button);
    }
  }
}
