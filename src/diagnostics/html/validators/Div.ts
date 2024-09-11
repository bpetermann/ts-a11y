import { AnyNode, Element } from 'domhandler';
import { DiagnosticSeverity } from 'vscode';
import { messages } from '../../utils/messages';
import ElementList from '../ElementList';
import { Validator, ValidatorError } from './Validator';

export class DivValidator implements Validator {
  private maxSequenceLength = 4;
  readonly #nodeTags = ['div'] as const;

  get nodeTags() {
    return this.#nodeTags;
  }
  validate(nodes: AnyNode[]): ValidatorError[] {
    const { elements: divs } = new ElementList(nodes);

    if (!divs.length) {
      return [];
    }

    return this.runChecks(divs);
  }

  private runChecks(divs: Element[]): ValidatorError[] {
    const errors: (ValidatorError | undefined)[] = [];

    divs.forEach((div) => {
      const attributes = div.attribs;

      if (Object.keys(attributes).length) {
        errors.push(this.checkButtonRole(div, attributes));
        errors.push(this.checkWrongAttibutes(div, attributes));
      }
    });

    errors.push(this.checkSequenceLength(ElementList.getLongestSequence(divs)));

    return errors.filter((error) => error instanceof ValidatorError);
  }

  private checkButtonRole(
    div: Element,
    attributes: { [name: string]: string }
  ): ValidatorError | undefined {
    if ('onclick' in attributes || attributes?.['role'] === 'button') {
      return new ValidatorError(
        messages.div.button,
        div,
        DiagnosticSeverity.Hint
      );
    }
  }

  private checkWrongAttibutes(
    div: Element,
    attributes: { [name: string]: string }
  ): ValidatorError | undefined {
    if ('aria-expanded' in attributes) {
      return new ValidatorError(
        messages.div.expanded,
        div,
        DiagnosticSeverity.Hint
      );
    }
  }

  private checkSequenceLength(
    longestSequence: Element[]
  ): ValidatorError | undefined {
    if (longestSequence.length >= this.maxSequenceLength) {
      return new ValidatorError(
        messages.div.soup,
        longestSequence[0],
        DiagnosticSeverity.Hint
      );
    }
  }
}
