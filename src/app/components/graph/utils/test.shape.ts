import { dia } from "@joint/core";
import { ACFlags } from "./acf-flag";
import * as AdaptiveCards from "adaptivecards";
import { acHostConfig } from "./acf-hosting";

export class AdaptiveCardModelView extends dia.ElementView { // prototype test
  // Override the default root element from <g> to <foreignObject>.
  override tagName = "foreignObject";
 adaptiveCard: AdaptiveCards.AdaptiveCard;
 resizeObserver: ResizeObserver;

  // Define attributes that trigger view updates on model changes.
  override presentationAttributes() {
    return {
      size: [ACFlags.UpdateView],
      position: [ACFlags.TransformView],
      angle: [ACFlags.TransformView],
      template: [ACFlags.RenderView],
      border: [ACFlags.UpdateView],
    };
  }

  // Specify initial flags reported when the view is initialized.
  override initFlag() {
    return [
      ACFlags.RenderView,
      ACFlags.UpdateView,
      ACFlags.TransformView,
      ACFlags.MeasureView,
    ];
  }

  // Confirms updates based on flags, triggering appropriate actions.
  override confirmUpdate(flags: any, opt: any):any {
    if (this.hasFlag(flags, ACFlags.RenderView)) this.render();
    if (this.hasFlag(flags, ACFlags.UpdateView)) this.update();
    if (this.hasFlag(flags, ACFlags.TransformView)) this.updateTransformation();
    if (this.hasFlag(flags, ACFlags.MeasureView)) this.resizeModel();
  }

  // Initialize the AdaptiveCard instance and its event handlers.
  override init() {

    //  Create an AdaptiveCard instance
            const adaptiveCard = new AdaptiveCards.AdaptiveCard();
            // Set the host styling
            adaptiveCard.hostConfig = acHostConfig;
            // Set the adaptive card's event handlers. onExecuteAction is invoked
            // whenever an action is clicked in the card
            adaptiveCard.onExecuteAction = (action) => this.onExecuteAction(action);
            // Keep a reference to the AdaptiveCard instance
            this.adaptiveCard = adaptiveCard;
            // Create a ResizeObserver to measure the card's size
            this.resizeObserver = new ResizeObserver(() => this.requestMeasurement());
  }

  // Handle actions executed within the AdaptiveCard.
  onExecuteAction(action: any) {
    if (action instanceof AdaptiveCards.SubmitAction) {
      this.notify("element:submit", action.data);
    } else if (action instanceof AdaptiveCards.OpenUrlAction) {
      this.notify("element:open-url", action.url);
    }
  }

  // Clean up resources when the view is removed.
  override onRemove() {
    this.releaseResources();
  }

  // Release resources and disconnect observers.
  releaseResources() {
    if (!this.adaptiveCard.renderedElement) return;

    this.el.removeChild(this.adaptiveCard.renderedElement);
    this.adaptiveCard.releaseDOMResources();
    this.resizeObserver.disconnect();
  }

  // Render the adaptive card.
  override render(): any {
    this.releaseResources();

    const cardEl = this.adaptiveCard.render() as HTMLElement;
    this.adaptiveCard.parse(this.model.get("template"));
    this.el.appendChild(cardEl);

    this.resizeObserver.observe(cardEl);
  }

  // Request a measurement update for the view.
  requestMeasurement(opt = {}) {
    this.requestUpdate(this.getFlag(ACFlags.MeasureView), opt);
  }

  // Resize the model to match the AdaptiveCard's height.
  resizeModel() {
    const { width, height } = this.model.size();
    const acHeight = this.adaptiveCard?.renderedElement?.offsetHeight;

    if (height === acHeight) return;

    this.model.resize(width, acHeight!, { view: this.cid });
    this.update();
  }

  // Update the view, including size and border of the card.
  override update() {
    const { width, height } = this.model.size();

    this.el.setAttribute("width", width.toString());
    this.el.setAttribute("height", height.toString());

    // this.adaptiveCard.renderedElement.style.border = this.model.get("border");

    this.cleanNodesCache();
  }
}

// Register the view in the joint.shapes namespace.
// joint.shapes.AdaptiveCardModelView = AdaptiveCardModelView;
