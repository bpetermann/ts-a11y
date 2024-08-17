import { AnyNode } from 'domhandler';
import { DiagnosticSeverity } from 'vscode';

export class ValidatorError {
  constructor(
    public message: string,
    public node?: AnyNode,
    public severity: DiagnosticSeverity = DiagnosticSeverity.Warning
  ) {}
}

export interface Validator {
  readonly nodeTags: readonly string[];
  validate(nodes: AnyNode[]): ValidatorError[];
}
