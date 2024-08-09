import { AnyNode } from 'domhandler';
import { warnings, Warning, defaultMessages } from './Warnings';
import HTMLElementValidator from './HtmlValidator';

export default class HtmlElement {
  constructor(
    private readonly tag: keyof typeof warnings,
    public readonly required: boolean,
    public readonly attributes: string[],
    public readonly unique: boolean,
    public nodes: AnyNode[] = [],
    private _warning: string = '',
    private err: boolean = false
  ) {}

  validate(domNodes: AnyNode[]): void {
    this.clearErrors();
    this.findElements(domNodes);
    const validator = new HTMLElementValidator(this);
    validator.validate();
  }
  get warning(): string {
    return this._warning;
  }

  get error(): boolean {
    return this.err;
  }

  clearErrors() {
    this.err = false;
    this._warning = '';
  }

  set error(constraint: Warning) {
    this.err = true;
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

  hasAttribute(attr: string): boolean {
    return this.nodes.some((node) => 'attribs' in node && node.attribs[attr]);
  }
}
