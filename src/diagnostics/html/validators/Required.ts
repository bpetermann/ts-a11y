import { Element } from 'domhandler';
import { DiagnosticSeverity } from 'vscode';
import { META, TITLE } from '../../utils/constants';
import { messages } from '../../utils/messages';
import ElementList from '../ElementList';
import { Validator, ValidatorError } from './Validator';

export class RequiredValidator implements Validator {
  readonly #nodeTags = [META, TITLE];

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
