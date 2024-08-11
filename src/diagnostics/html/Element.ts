import { AnyNode } from 'domhandler';
import { warnings, defaultMessages } from './Warnings';
import Validator from './Validator';
import { Constraint, Tag, WarningKey } from '../../types/html';
import NodeList from './NodeList';

export default class Element {
  public nodes: NodeList = new NodeList();
  #warning: string | null = null;
  #error: boolean = false;

  constructor(
    public tag: Tag,
    public constraints: Constraint[],
    public attributes: string[] = []
  ) {}

  get warning(): string {
    return this.#warning ?? '';
  }

  set warning(msg: WarningKey | null) {
    this.#warning = msg
      ? warnings[this.tag][msg] || defaultMessages[msg] + this.tag
      : null;
  }

  get error(): boolean {
    return this.#error;
  }

  set error(hasError: boolean) {
    this.#error = hasError;
  }

  validate(domNodes: AnyNode[]): void {
    this.clearErrors();
    this.nodes.set(domNodes, this.tag);

    new Validator(this).validate();
  }

  clearErrors(): void {
    this.error = false;
    this.warning = null;
  }

  getFirstNode(): AnyNode | undefined {
    return this.nodes.first;
  }
}
