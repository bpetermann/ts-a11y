import { AnyNode, Element } from 'domhandler';
import { messages } from '../messages';
import { DiagnosticSeverity } from 'vscode';
import { Validator, ValidatorError } from './validator';
import ElementList from '../elements';

export class DivValidator implements Validator {
  private maxSequenceLength = 4;
  readonly #nodeTags = ['div'] as const;

  get nodeTags() {
    return this.#nodeTags;
  }
  validate(nodes: AnyNode[]): ValidatorError[] {
    const elementList = new ElementList(nodes);
    const { elements: divs } = elementList;

    if (!divs.length) {
      return [];
    }

    return this.runChecks(divs, elementList);
  }

  private runChecks(
    divs: Element[],
    elementList: ElementList
  ): ValidatorError[] {
    const errors: (ValidatorError | undefined)[] = [];

    divs.forEach((div) => {
      const attributes = elementList.getElementAttributes(div);

      if (Object.keys(attributes).length) {
        errors.push(this.checkButtonRole(div, attributes));
        errors.push(this.checkWrongAttibutes(div, attributes));
      }
    });

    errors.push(this.checkSequenceLength(elementList.getLongestSequence(divs)));

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
