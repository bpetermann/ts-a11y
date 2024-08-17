import { AnyNode } from 'domhandler';
import { messages } from '../messages';
import NodeList from '../nodelist';
import { Validator, ValidatorError } from './Validator';
import { DiagnosticSeverity } from 'vscode';

export class RequiredValidator implements Validator {
  readonly #nodeTags = ['meta', 'title'] as const;

  get nodeTags() {
    return this.#nodeTags;
  }

  validate(domNodes: AnyNode[]): ValidatorError[] {
    const errors: ValidatorError[] = [];
    const { findNodeByTag } = NodeList;

    this.nodeTags.forEach((tag) => {
      if (!findNodeByTag(domNodes, tag)) {
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
