import { Diagnostic } from '../diagnostic';
import { TSXElement } from '../element';

export interface Validator {
  readonly tags: readonly string[];
  validate(node: TSXElement): Diagnostic[];
}
