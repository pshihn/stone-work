import { Tiler, TilerRegistry } from './tiler'

export class SquareTiler extends Tiler {
  add(node, options) {
    let cell = this.nextCell;
    let xy = this.getCellCoordinates(cell);

    // add cell panel
    let panel = document.createElement("div");
    panel.style.position = "absolute";
    panel.style.left = xy[0] + "px";
    panel.style.top = xy[1] + "px";
    panel.style.width = this.cellWidth + "px";
    panel.style.height = this.cellHeight + "px";
    panel.classList.add('sw-cell-panel');
    this._root.appendChild(panel);
    this.applyPanelStyles(panel, options);

    // apply node styles and append to panel
    node.classList.add('sw-cell-content');
    node.style.position = "absolute";
    node.style.left = 0;
    node.style.right = 0;
    node.style.top = 0;
    node.style.bottom = 0;
    panel.appendChild(node);

    this.addToColumn(cell[0], node);
  }

  applyPanelStyles(panel, options) {
    if (!options) {
      return;
    }
    let style = panel.style;
    // background-color
    if (options.backgroundColor) {
      style.backgroundColor = options.backgroundColor;
    }
    // bg-imag
    if (options.backgroundImage) {
      style.backgroundSize = "cover";
      style.backgroundOrigin = "border-box";
      style.backgroundPosition = "50% 50%";
      sttyle.backgroundImage = 'url("' + options.backgroundImage + '")';
    }
  }
}

TilerRegistry.add("square", SquareTiler);