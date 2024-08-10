import { AnyNode } from 'domhandler';
import { warnings, defaultMessages } from './Warnings';
import HtmlElementValidator from './HtmlValidator';
import { Constraint, Tag, WarningKey } from '../types';

export default class HtmlElement {
  public nodes: AnyNode[] = [];
  #warning: string = '';
  #error: boolean = false;

  constructor(
    public tag: Tag,
    public constraints: Constraint[],
    public attributes: string[] = []
  ) {}

  get warning(): string {
    return this.#warning;
  }

  set warning(constraint: WarningKey) {
    this.#warning =
      warnings[this.tag][constraint] || defaultMessages[constraint] + this.tag;
  }

  get error(): boolean {
    return this.#error;
  }

  set error(constraint: WarningKey) {
    if (!this.#error) {
      this.#error = true;
      this.warning = constraint;
    }
  }

  validate(domNodes: AnyNode[]): void {
    this.clearErrors();
    this.findElements(domNodes);

    new HtmlElementValidator(this, this.constraints).validate();
  }

  clearErrors() {
    this.#error = false;
    this.#warning = '';
  }

  private findElements(nodes: AnyNode[]): void {
    this.nodes = nodes.filter(
      (node) => 'name' in node && node.name === this.tag
    );
  }

  public hasAttribute(attr: string): boolean {
    return this.nodes.some((node) => 'attribs' in node && node.attribs[attr]);
  }

  private hasAnyRequiredAttribute(node: AnyNode): boolean {
    return (
      'attribs' in node &&
      Object.keys(node.attribs).some((key) => this.attributes.includes(key))
    );
  }

  public allNodesHaveAttribs(): boolean {
    return this.nodes.every((node) => this.hasAnyRequiredAttribute(node));
  }

  public anyNodeHasAttribs(): boolean {
    return this.attributes.every((attr) => this.hasAttribute(attr));
  }
}
