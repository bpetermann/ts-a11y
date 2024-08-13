import { AnyNode } from 'domhandler';

export interface Warnings {
  [tag: string]: string;
}

export interface Validator {
  warnings: Warnings;
  validate(nodes: AnyNode[]): string[];
}
