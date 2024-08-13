import { dia } from "jointjs-plus";

export const Link = dia.Link.define('Link', {
    attrs: {
        root: {
            cursor: 'pointer'
        },
        line: {
            connection: true,
            stroke: '#78849E',
            strokeWidth: 1,
            fill: 'none',

            sourceMarker: {
                d: 'M 10 0 L 0 5 L 10 10 z',
            }
        },
    }
}, {
    markup: [{
        tagName: 'path',
        selector: 'line'
    }]
});
