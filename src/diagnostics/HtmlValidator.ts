import HtmlElement from './HtmlElement';
import { Warning } from './Warnings';

export default class HtmlElementValidator {
  constructor(
    private readonly element: HtmlElement,
    private validators: Array<() => void> = []
  ) {
    this.validators = this.initializeValidators();
  }

  validate(): void {
    this.validators.forEach((validate) => validate());
  }

  private initializeValidators(): Array<() => void> {
    if (this.element.specialCase) {
      return [this.handleSpecialCases.bind(this)];
    }
    return [
      this.checkExistence.bind(this),
      this.checkUniqueness.bind(this),
      this.checkAttributes.bind(this),
    ];
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

  private handleSpecialCases(): void {
    switch (this.element.tag) {
      case 'nav':
        this.checkNavElements();
        break;
      default:
        console.warn(`No special case handler for tag: ${this.element.tag}`);
    }
  }

  private checkNavElements() {
    const hasAttributes = this.element.allNodesHaveRequiredAttributes();

    if (this.element.nodes.length > 1 && !hasAttributes) {
      this.element.error = Warning.hasMissingAttribute;
    }
  }
}
