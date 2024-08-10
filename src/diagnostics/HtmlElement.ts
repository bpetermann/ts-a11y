import { AnyNode } from 'domhandler';
import { warnings, WarningKey, defaultMessages } from './Warnings';
import HtmlElementValidator from './HtmlValidator';

export default class HtmlElement {
  public readonly tag: keyof typeof warnings;
  public readonly specialCase: boolean;
  public readonly attributes: string[];
  public readonly required: boolean;
  public readonly unique: boolean;
  public nodes: AnyNode[] = [];
  #warning: string = '';
  #error: boolean = false;

  constructor(
    tag: keyof typeof warnings,
    constraint: {
      specialCase?: boolean;
      attributes?: string[];
      required?: boolean;
      unique?: boolean;
    } = {}
  ) {
    this.tag = tag;
    this.specialCase = constraint.specialCase ?? false;
    this.attributes = constraint.attributes ?? [];
    this.required = constraint.required ?? false;
    this.unique = constraint.unique ?? false;
  }

  get warning(): string {
    return this.#warning;
  }

  get error(): boolean {
    return this.#error;
  }

  validate(domNodes: AnyNode[]): void {
    this.clearErrors();
    this.findElements(domNodes);

    const validator = new HtmlElementValidator(this);
    validator.validate();
  }

  clearErrors() {
    this.#error = false;
    this.#warning = '';
  }

  private findElements(nodes: AnyNode[]): void {
    this.nodes = nodes.filter(
      (node) => node && 'name' in node && node.name === this.tag
    );
  }

  set error(constraint: WarningKey) {
    if (this.#error) {
      return;
    }
    this.#error = true;
    this.setMessage(constraint);
  }

  private setMessage(constraint: WarningKey) {
    this.#warning =
      warnings[this.tag][constraint] || defaultMessages[constraint] + this.tag;
  }

  public hasAttribute(attr: string): boolean {
    return this.nodes.some((node) => 'attribs' in node && node.attribs[attr]);
  }

  private hasAnyRequiredAttribute(node: AnyNode): boolean {
    if (!('attribs' in node)) {
      return false;
    }
    const { attribs } = node;
    return Object.keys(attribs).some((key) => this.attributes.includes(key));
  }

  public allNodesHaveRequiredAttributes(): boolean {
    return this.nodes.every((node) => this.hasAnyRequiredAttribute(node));
  }

  public anyNodeHasRequiredAttribute(): boolean {
    return this.attributes.every((attr) => this.hasAttribute(attr));
  }
}
