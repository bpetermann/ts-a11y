import { Constraint, WarningKey } from '../../types/html';
import Element from './Element';

export default class Validator {
  constructor(private readonly element: Element) {}

  validate(): void {
    this.element.constraints.forEach((check) => this[check].bind(this)());
  }

  report(warning: WarningKey): void {
    this.element.warning = warning;
    this.element.error = true;
  }

  private checkExistence(): void {
    if (!this.element.nodes.length) {
      this.report(WarningKey.Exist);
    }
  }

  private checkUniqueness(): void {
    if (this.element.nodes.length > 1) {
      this.report(WarningKey.Unique);
    }
  }

  private checkAttributes(): void {
    if (!this.element.nodes.anyNodeHasAttribs(this.element.attributes)) {
      this.report(WarningKey.Attributes);
    }
  }

  private checkNavElements() {
    if (
      this.element.nodes.length > 1 &&
      !this.element.nodes.allNodesHaveAttribs(this.element.attributes)
    ) {
      this.report(WarningKey.Attributes);
    }
  }
}
