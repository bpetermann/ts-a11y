import { AnyNode } from 'domhandler';
import { messages } from '../messages';
import { Validator, ValidatorError } from './validator';
import { DiagnosticSeverity } from 'vscode';
import ElementList from '../elements';

export class RequiredValidator implements Validator {
  readonly #nodeTags = ['meta', 'title'] as const;

  get nodeTags() {
    return this.#nodeTags;
  }

  validate(domNodes: AnyNode[]): ValidatorError[] {
    const errors: ValidatorError[] = [];
    const { findElementByTag } = ElementList;

    this.nodeTags.forEach((tag) => {
      if (!findElementByTag(domNodes, tag)) {
        errors.push(
          new ValidatorError(
            messages[tag].shouldExist,
            undefined,
            DiagnosticSeverity.Error
          )
        );
      }
    });

    return errors;
  }
}
