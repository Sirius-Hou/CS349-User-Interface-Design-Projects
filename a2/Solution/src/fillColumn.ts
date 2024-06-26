import {
  SKElement,
  LayoutMethod,
  Size,
} from "simplekit/imperative-mode";




export function makeFillColLayout(
  params: { gap: number } = { gap: 0 }
): LayoutMethod {
  return (
    boundsWidth: number,
    boundsHeight: number,
    elements: SKElement[]
  ) => {
    return fillColLayout(boundsWidth, boundsHeight, elements, params);
  };
}


function fillColLayout(
boundsWidth: number,
boundsHeight: number,
elements: SKElement[],
params: { gap: number } = { gap: 0 }
): Size {
const newBounds: Size = { width: 0, height: 0 };
const gap = params.gap;

// get total "basis" height
const basisTotal = elements.reduce(
  (acc, el) => acc + el.heightBasis,
  0
);

// calculate remaining space to distribute elements
const available = boundsHeight - (elements.length - 1) * gap;
const remaining = available - basisTotal;

// get total fill proportion
const fillTotal = elements.reduce(
  (acc, el) => acc + el.fillHeight,
  0
);

// first element starts at top left
let x = 0;
let y = 0;
let columnWidth = 0;

elements.forEach((el) => {
  // set element position
  el.x = x;
  el.y = y;

  // calculate element size
  let h = el.heightBasis;
  // expand or shrink element if fillHeight > 0
  if (fillTotal > 0) {
    h += (el.fillHeight / fillTotal) * remaining;
  }
  // set element size
  el.heightLayout = h;

  // elements can expand horizontally too
  if (el.fillWidth > 0) {
    el.widthLayout = boundsWidth;
  }
  // update column width
  columnWidth = Math.max(columnWidth, el.widthLayout);
  // ready for next y position
  y += h + gap;
});

// calculate bounds used for layout
const lastEl = elements.slice(-1)[0];
newBounds.height = lastEl.y + lastEl.heightLayout;
newBounds.width = columnWidth;

return newBounds;
}

