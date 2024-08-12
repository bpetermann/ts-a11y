import { AnyNode } from 'domhandler';

export interface Elements {
  [tag: string]: string;
}

export interface Validator {
  elements: Elements;
  validate(nodes: AnyNode[]): string[];
}
