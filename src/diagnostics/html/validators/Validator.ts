import { Element } from 'domhandler';
import { DiagnosticSeverity } from 'vscode';

export class ValidatorError {
  constructor(
    public message: string,
    public node?: Element,
    public severity: DiagnosticSeverity = DiagnosticSeverity.Warning
  ) {}
}

export interface Validator {
  readonly nodeTags: readonly string[];
  validate(nodes: Element[]): ValidatorError[];
}
