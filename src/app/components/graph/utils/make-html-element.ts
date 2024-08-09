import * as joint from "jointjs";
import * as AdaptiveCards from "adaptivecards";

export function makeHtmlElement(node: any) {
  const width = 180;
  const height = 170;
  const letterSize = 8;
  const json = {
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    type: "AdaptiveCard",
    version: "1.2",
    body: [
      {
        type: "TextBlock",
        text: "Message Type",
        weight: "Bolder",
        size: "Medium",
        color: "Dark",
        horizontalAlignment: "Left",
      },
      {
        type: "TextBlock",
        text: "Identifies each message version number, message class, message function and the transaction originator.",
        wrap: true,
      },
    ],
    actions: [
      {
        type: "Action.ShowCard",
        title: "Show Details",
        card: {
          type: "AdaptiveCard",
          $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
          body: [
            {
              type: "FactSet",
              facts: [
                {
                  title: "Business Alias",
                  value: "Message Code, Message Type Indicator",
                },
                { title: "Canonical Name", value: "MTI" },
                { title: "Field Type", value: "string" },
                { title: "Field Length", value: "4" },
                { title: "Pattern", value: "N/A" },
                { title: "Value Transalation", value: "Y" },
                { title: "Data Policy", value: "N/A" },
                { title: "Data Retention", value: "2 Years" },
                { title: "Classification", value: "N/A" },
              ],
            },
          ],
        },
      },
    ],
  };

  // 1. create an instance of adaptive cards
  const adaptiveCard = new AdaptiveCards.AdaptiveCard();
  // 2. parse the json payload
  adaptiveCard.parse(json);
  // 3. render the card
  const nz = adaptiveCard.render();
  // 4. attach to the DOM

  return new joint.shapes.basic.Rect({
    id: node.id,
    size: { width: width, height: height },
    attrs: {
      text: {
        "font-size": letterSize,
        "font-family": "monospace",
      },
      rect: {
        width: width,
        height: height,
        rx: 5,
        ry: 5,
        stroke: "#555",
      },
    },
    markup: joint.util.svg/* xml */ `
               <foreignObject width="${width}" height="${height}"
                           requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
              <!-- XHTML content goes here -->
             ${nz?.innerHTML}
            </foreignObject>
              `,
  });
}
