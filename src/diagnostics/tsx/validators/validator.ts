import { JSXOpeningElement } from '@babel/types';
import { Diagnostic } from '../diagnostic';

export interface Validator {
  readonly tags: readonly string[];
  validate(node: JSXOpeningElement): Diagnostic[];
}
