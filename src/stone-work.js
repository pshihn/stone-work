import { TilerRegistry } from './tiler';
import { SquareTiler } from './square-tiler';
import { RhombusTiler } from './rhombus-tiler';

export class StoneWork {
  constructor(element, tilerType, options) {
    if (!tilerType) {
      tilerType = "square";
    }
    if (!options) {
      options = {};
    }
    if (!options.cellWidth) {
      options.cellWidth = 300;
    }
    if (!options.cellHeight) {
      options.cellHeight = 300;
    }
    if (!options.cellSpacing) {
      options.cellSpacing = 0;
    }

    let classType = TilerRegistry.type(tilerType);
    if (!classType) {
      console.error("Failed to initialize. Invalid tiler type.");
      return;
    }
    this._tiler = new classType(element, options);
  }

  add(node, options) {
    this._tiler.add(node, options);
  }

  clear() {
    this._tiler.clear();
  }
}