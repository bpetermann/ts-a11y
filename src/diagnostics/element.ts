import { AnyNode } from 'domhandler';
import { warnings, Warning, defaultWarnings } from './warnings';

export default class Element {
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
    this.checkExistence();
    this.checkUniqueness();
    this.checkAttributes();
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
    this._warning =
      constraint in warnings[key]
        ? (warnings[key] as any)[constraint]
        : `${defaultWarnings[constraint]}${this.tag}`;
  }

  private checkExistence(): void {
    if (this.required && !this.nodes.length) {
      this.error = Warning.shouldExist;
    }
  }

  private checkUniqueness(): void {
    if (!this.err && this.unique && this.nodes.length > 1) {
      this.error = Warning.shouldBeUnique;
    }
  }

  private checkAttributes(): void {
    if (
      !this.err &&
      this.attributes.length &&
      !this.attributes.every((attr) => this.hasAttribute(attr))
    ) {
      this.error = Warning.hasMissingAttribute;
    }
  }

  private findElements(nodes: AnyNode[]): void {
    this.nodes = nodes.filter(
      (node) => node && 'name' in node && node.name === this.tag
    );
  }

  private hasAttribute(attr: string): boolean {
    return this.nodes.some((node) => 'attribs' in node && node.attribs[attr]);
  }
}
