import { Tiler, TilerRegistry } from './tiler'

export class RhombusTiler extends Tiler {
  computeColumnCount() {
    let totalWidth = this._root.offsetWidth;
    this._colCount = Math.max(1, Math.floor(totalWidth / this.cellWidth));
    if (this._colCount > 1) {
      let effectiveWidth = (this._colCount * this.cellWidth) + ((this._colCount - 1) * this.cellSpacing);
      if (effectiveWidth > totalWidth) {
        this._colCount--;
      }
    }
    this._colCount += this._colCount - 1;
  }

  clear() {
    super.clear();
    this.svg = this.createSvgRoot();
    this.svgHeight = 0;
  }

  add(node, options) {
    let cell = this.nextCell;

    let polygon = this.createSvgNode("polygon", {
      points: this._getPolygonPoints()
    });
    let xy = this._cellRectPosition(cell);
    polygon.style.transform = "translate(" + xy[0] + "px," + xy[1] + "px)";
    this.svg.appendChild(polygon);
    this.applyPanelStyles(polygon, options);

    let svgHeight = xy[1] + this.cellHeight;
    if (svgHeight > this.svgHeight) {
      this.svg.setAttribute("height", svgHeight + "px");
    }
    this.addToColumn(cell[0], node);
  }

  _getPolygonTransform(cell) {
    let xy = this._cellRectPosition(cell);
    return "translate(" + xy[0] + "px," + xy[1] + "px)";
  }

  _getPolygonPoints() {
    let points = [
      [0, this.cellHeight / 2],
      [this.cellWidth / 2, 0],
      [this.cellWidth, this.cellHeight / 2],
      [this.cellWidth / 2, this.cellHeight]
    ];
    let p = "";
    for (let i = 0; i < points.length; i++) {
      p += points[i][0] + "," + points[i][1] + " ";
    }
    return p.trim();
  }

  _cellRectPosition(cell) {
    let colWrap = ((this._colCount + 1) / 2) - 1;
    let offseted = cell[0] > colWrap;
    if (!offseted) {
      let x = cell[0] * (this.cellWidth + this.cellSpacing);
      let y = cell[1] * (this.cellHeight + this.cellSpacing);
      return [x, y];
    } else {
      let col = cell[0] - colWrap;
      let x = col * (this.cellWidth + this.cellSpacing) - (this.cellWidth / 2) - (this.cellSpacing / 2);
      let y = cell[1] * (this.cellHeight + this.cellSpacing) + (this.cellHeight / 2) + (this.cellSpacing / 2)
      return [x, y];
    }
  }

  applyPanelStyles(panel, options) {
    let style = panel.style;

    // style.stroke = "#000";
    // style.strokeWidth = "2";

    if (options.backgroundColor) {
      style.fill = options.backgroundColor;
    } else {
      style.fill = "transparent";
    }
  }
}

TilerRegistry.add("rhombus", RhombusTiler);