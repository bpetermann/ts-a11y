import { Diagnostic } from '../Diagnostic';
import { TSXElement } from '../Element';

export interface Validator {
  readonly tags: readonly string[];
  validate(node: TSXElement): Diagnostic[];
}
