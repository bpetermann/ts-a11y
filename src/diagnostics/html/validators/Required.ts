import { Element } from 'domhandler';
import { messages } from '../../utils/messages';
import { Validator, ValidatorError } from './Validator';
import { DiagnosticSeverity } from 'vscode';
import ElementList from '../ElementList';

export class RequiredValidator implements Validator {
  readonly #nodeTags = ['meta', 'title'] as const;

  get nodeTags() {
    return this.#nodeTags;
  }

  validate(domNodes: Element[]): ValidatorError[] {
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
