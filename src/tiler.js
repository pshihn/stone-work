const _registry = {};

export class TilerRegistry {
  static add(name, classType) {
    _registry[name] = classType;
  }

  static type(name) {
    return _registry[name];
  }
}

export class Tiler {
  constructor(element, options) {
    this._root = element;
    this._options = options;
    this.clear();
  }

  _clearNode(node) {
    while (node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }
  }

  clear() {
    this._clearNode(this._root);
    this._colCount = 0;
    this._columns = [];
    this._columnHeights = [];
    this.computeSizes();
  }

  computeSizes() {
    let totalWidth = this._root.offsetWidth;
    this._colCount = Math.max(1, Math.floor(totalWidth / this.cellWidth));
    if (this._colCount > 1) {
      let effectiveWidth = (this._colCount * this.cellWidth) + ((this._colCount - 1) * this.cellSpacing);
      if (effectiveWidth > totalWidth) {
        this._colCount--;
      }
    }
    console.log("colCount", this.colCount);
    this._columns = [];
    this._columnHeights = [];
    for (let i = 0; i < this._colCount; i++) {
      this._columns.push([]);
      this._columnHeights.push(0);
    }
  }

  get colCount() {
    return this._colCount;
  }

  get cellWidth() {
    return this._options.cellWidth || 300;
  }

  get cellHeight() {
    return this._options.cellHeight || 300;
  }

  get cellSpacing() {
    return this._options.cellSpacing || 0;
  }

  getCellCoordinates(cell) {
    let x = cell[0] * (this.cellWidth + this.cellSpacing);
    let y = cell[1] * (this.cellHeight + this.cellSpacing);
    return [x, y];
  }

  get nextCell() {
    let index = 0;
    if (this.colCount > 1) {
      let min = -1;
      for (let i = 0; i < this.colCount; i++) {
        let h = this._columnHeights[i];
        if (min < 0 || h < min) {
          min = h;
          index = i;
        }
      }
    }
    return [index, this._columnHeights[index]];
  }

  addToColumn(index, node) {
    if (index < this.colCount) {
      this._columns[index].push(node);
      this._columnHeights[index]++;
    }
  }

  add(node) {
  }

  applyPanelStyles(panel, options) {
  }
}