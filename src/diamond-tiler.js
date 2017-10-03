import { Tiler, TilerRegistry } from './tiler'

export class DiamondTiler extends Tiler {
  computeColumnCount() {
    let totalWidth = this._root.offsetWidth;
    this._colCount = Math.max(1, Math.floor(totalWidth / this.cellWidth));
    if (this._colCount > 1) {
      let effectiveWidth = (this._colCount * this.cellWidth) + ((this._colCount - 1) * this.cellSpacing);
      if (effectiveWidth > totalWidth) {
        this._colCount--;
      }
    }
    this._colwrap = this.colCount - 1;
    if (this.colCount >= 2) {
      this._evenTiler = false;
      let effectiveWidth = (this._colCount * this.cellWidth) + ((this._colCount - 1) * this.cellSpacing);
      let diff = totalWidth - effectiveWidth;
      if (diff >= (this.cellWidth / 2 + (2 * this.cellSpacing))) {
        this._evenTiler = true;
      }
      this._colCount += this._evenTiler ? this._colCount : (this._colCount - 1);
    }
  }

  clear() {
    super.clear();
    this.svg = this.createSvgRoot();
    this.defs = this.createSvgNode("defs");
    this.nodeCount = 0;
    this.svg.appendChild(this.defs);
    this.svgHeight = 0;
  }

  add(node, options) {
    let cell = this.nextCell;

    // create base panel
    let polygon = this.createSvgNode("polygon", {
      points: this._getPolygonPoints()
    });
    let xy = this._cellRectPosition(cell);
    polygon.style.transform = "translate(" + xy[0] + "px," + xy[1] + "px)";
    this.svg.appendChild(polygon);
    this.applyPanelStyles(polygon, options);

    // Update svg height
    let svgHeight = xy[1] + this.cellHeight;
    if (svgHeight > this.svgHeight) {
      this.svg.setAttribute("height", svgHeight + "px");
    }

    // add node
    let nodeRect = this._getNodeRect(xy);
    node.classList.add('sw-cell-content');
    node.style.position = "absolute";
    node.style.left = nodeRect[0] + "px";
    node.style.top = nodeRect[1] + "px";
    node.style.width = nodeRect[2] + "px";
    node.style.height = nodeRect[3] + "px";
    this._root.appendChild(node);
    this.nodeCount++;

    this.addToColumn(cell[0], node);
  }

  _getNodeRect(pos) {
    let hw = this.cellWidth / 2;
    let hh = this.cellHeight / 2;
    let c = [pos[0] + hw, pos[1] + hh];
    let x = (this.cellWidth / 2) / Math.sqrt(2);
    let y = (this.cellHeight / 2) / Math.sqrt(2);
    let rect = [c[0] - x, c[1] - y, 2 * x, 2 * y];
    let slope = -hh / hw;
    let offset = pos[1] - (slope * (pos[0] + hw));
    let d = Math.abs(slope * rect[0] - rect[1] + offset) / Math.sqrt(slope * slope + 1);

    let p0 = rect[0];
    let p1 = rect[1];
    let qa = 1 + Math.pow(slope, 2);
    let qb = 2 * ((slope * offset) - (slope * p1) - p0);
    let qc = Math.pow(p0, 2) - Math.pow(d, 2) + Math.pow((offset - p1), 2);
    let x0 = (-qb + Math.sqrt(Math.abs((qb * qb) - (4 * qa * qc)))) / (2 * qa);
    let y0 = slope * x0 + offset;
    let dx = x0 - p0;
    let dy = y0 - p1;
    rect[0] = x0;
    rect[1] = y0;
    rect[2] = rect[2] - 2 * dx;
    rect[3] = rect[3] - 2 * dy;
    return rect;
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
    let colWrap = this._colwrap;
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

    // bg-color
    if (options.backgroundColor) {
      style.fill = options.backgroundColor;
    } else {
      style.fill = "transparent";
    }

    // bg-imag
    if (options.backgroundImage) {
      let id = "image" + this.nodeCount;
      let pattern = this.createSvgNode("pattern", {
        id: id,
        width: "100%",
        height: "100%"
      });
      let image = this.createSvgNode("image", {
        x: 0,
        y: 0,
        width: this.cellWidth,
        height: this.cellHeight,
        preserveAspectRatio: 'xMinYMin slice',
        'href': options.backgroundImage
      });
      pattern.appendChild(image);
      this.defs.appendChild(pattern);
      style.fill = "url(#" + id + ")";
    }

  }
}

TilerRegistry.add("diamond", DiamondTiler);