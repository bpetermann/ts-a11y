import { Constraint, WarningKey } from '../types';
import HtmlElement from './HtmlElement';

export default class HtmlElementValidator {
  constructor(
    private readonly element: HtmlElement,
    private readonly constraints: Constraint[]
  ) {}

  validate(): void {
    this.constraints.forEach((check) => this[check].bind(this)());
  }

  private checkExistence(): void {
    if (!this.element.nodes.length) {
      this.element.error = WarningKey.Exist;
    }
  }

  private checkUniqueness(): void {
    if (this.element.nodes.length > 1) {
      this.element.error = WarningKey.Unique;
    }
  }

  private checkAttributes(): void {
    if (!this.element.anyNodeHasAttribs()) {
      this.element.error = WarningKey.Attributes;
    }
  }

  private checkNavElements() {
    if (this.element.nodes.length > 1 && !this.element.allNodesHaveAttribs()) {
      this.element.error = WarningKey.Attributes;
    }
  }
}
