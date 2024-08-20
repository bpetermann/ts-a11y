import { AnyNode, Element } from 'domhandler';
import { messages } from '../messages';
import { DiagnosticSeverity } from 'vscode';
import { Validator, ValidatorError } from './validator';
import ElementList from '../elements';

export class DivValidator implements Validator {
  readonly #nodeTags = ['div'] as const;

  get nodeTags() {
    return this.#nodeTags;
  }
  validate(nodes: AnyNode[]): ValidatorError[] {
    const { elements: divs, getElementAttributes } = new ElementList(
      nodes,
      'div'
    );

    if (!divs.length) {
      return [];
    }

    return this.runChecks(divs, getElementAttributes);
  }

  private runChecks(
    divs: Element[],
    getElementAttributes: (element: Element) => { [name: string]: string }
  ): ValidatorError[] {
    const errors: (ValidatorError | undefined)[] = [];

    divs.forEach((div) => {
      const attributes = getElementAttributes(div);

      if (Object.keys(attributes).length) {
        errors.push(this.checkButtonRole(div, attributes));
        errors.push(this.checkWrongAttibutes(div, attributes));
      }
    });

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
}
