import { AnyNode } from 'domhandler';
import { warnings, Warning, defaultMessages } from './Warnings';
import HtmlElementValidator from './HtmlValidator';

export default class HtmlElement {
  public readonly tag: keyof typeof warnings;
  public readonly specialCase: boolean;
  public readonly attributes: string[];
  public readonly required: boolean;
  public readonly unique: boolean;
  public nodes: AnyNode[] = [];
  private _warning: string = '';
  private _error: boolean = false;

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
    return this._warning;
  }

  get error(): boolean {
    return this._error;
  }

  validate(domNodes: AnyNode[]): void {
    this.clearErrors();
    this.findElements(domNodes);

    const validator = new HtmlElementValidator(this);
    validator.validate();
  }

  clearErrors() {
    this._error = false;
    this._warning = '';
  }

  set error(constraint: Warning) {
    this._error = true;
    const key = this.tag as keyof typeof warnings;
    const message =
      (warnings[key] as any)?.[constraint] ||
      `${defaultMessages[constraint]}${this.tag}`;
    this._warning = message;
  }

  private findElements(nodes: AnyNode[]): void {
    this.nodes = nodes.filter(
      (node) => node && 'name' in node && node.name === this.tag
    );
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
}
