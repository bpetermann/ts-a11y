import HtmlElement from './HtmlElement';
import { Warning } from './Warnings';

export default class HTMLElementValidator {
  constructor(
    private readonly element: HtmlElement,
    private validators: Array<() => void> = []
  ) {
    this.validators =
      validators.length > 0
        ? validators
        : [
            this.checkExistence.bind(this),
            this.checkUniqueness.bind(this),
            this.checkAttributes.bind(this),
          ];
  }

  validate(): void {
    this.validators.forEach((validate) => validate());
  }

  private checkExistence(): void {
    if (this.element.required && !this.element.nodes.length) {
      this.element.error = Warning.shouldExist;
    }
  }

  private checkUniqueness(): void {
    if (
      !this.element.error &&
      this.element.unique &&
      this.element.nodes.length > 1
    ) {
      this.element.error = Warning.shouldBeUnique;
    }
  }

  private checkAttributes(): void {
    if (!this.element.error && this.element.attributes.length) {
      const missingAttributes = this.element.attributes.filter(
        (attr) => !this.element.hasAttribute(attr)
      );
      if (missingAttributes.length > 0) {
        this.element.error = Warning.hasMissingAttribute;
      }
    }
  }
}
