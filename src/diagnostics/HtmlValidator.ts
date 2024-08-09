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
    const { specialCase, attributes, required, unique } = this.element;
    const validators = [];

    if (specialCase) {
      return [this.handleSpecialCases.bind(this)];
    }
    if (attributes.length) {
      validators.push(this.checkAttributes.bind(this));
    }
    if (required) {
      validators.push(this.checkExistence.bind(this));
    }
    if (unique) {
      validators.push(this.checkUniqueness.bind(this));
    }
    return validators;
  }

  private checkExistence(): void {
    if (!this.element.error && !this.element.nodes.length) {
      this.element.error = Warning.shouldExist;
    }
  }

  private checkUniqueness(): void {
    if (!this.element.error && this.element.nodes.length > 1) {
      this.element.error = Warning.shouldBeUnique;
    }
  }

  private checkAttributes(): void {
    const missingAttributes = this.element.attributes.filter(
      (attr) => !this.element.hasAttribute(attr)
    );

    if (!this.element.error && missingAttributes.length) {
      this.element.error = Warning.hasMissingAttribute;
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
    if (
      this.element.nodes.length > 1 &&
      !this.element.allNodesHaveRequiredAttributes()
    ) {
      this.element.error = Warning.hasMissingAttribute;
    }
  }
}
