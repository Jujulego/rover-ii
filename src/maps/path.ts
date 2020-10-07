import { IndexedArray } from 'src/utils/indexed-array';
import { Vector } from 'src/utils/math2d';

// Types
type Corner = 'tl' | 'bl' | 'br' | 'tr';
type Corners = Record<Corner, (pt: Vector) => string>;

// Class
export class Path {
  // Attributes
  private _points = new IndexedArray<Vector>((u, v) => u.compare(v));

  // Methods
  *[Symbol.iterator]() {
    yield* this._points;
  }

  item(idx: number): Vector | undefined {
    return this._points.item(idx);
  }

  cyclicItem(idx: number): Vector {
    while (idx < 0) idx += this.length;
    return this._points.item(idx % this.length)!;
  }

  indexOf(pt: Vector): number {
    return this._points.indexOf(pt);
  }

  contains(pt: Vector): boolean {
    return this._points.contains(pt);
  }

  verticalNearest(pt: Vector): Vector {
    const points = this._points.nearestValues(pt);
    let near = points[0];
    let dist = near.distance(pt, 'manhattan');

    for (const p of points) {
      const d = p.distance(pt, 'manhattan');

      if (d < dist) {
        near = p;
        dist = d;
      }
    }

    return near;
  }

  push(u: Vector) {
    this._points.push(u);
  }

  insert(idx: number, ...points: Vector[]) {
    this._points.insert(idx, ...points);
  }

  // - rendering
  private renderZone(corners: Corners): string {
    // no tiles
    if (this.length === 0) {
      return '';
    }

    // 1 tile path
    if (this.length === 1) {
      const pt = this._points.item(0)!;
      return `M ${corners.tl(pt)} L ${corners.bl(pt)} L ${corners.br(pt)} L ${corners.tr(pt)} Z`;
    }

    // Build path
    let path = '';

    for (let i = 0; i < this.length; ++i) {
      const cmd = path ? ' L' : 'M';

      // Get points
      const pt = this._points.item(i)!;
      const prev = this.cyclicItem(i - 1);
      const next = this.cyclicItem(i + 1);

      // Compute direction and turn test
      const fromPrev = pt.sub(prev);
      const toNext = next.sub(pt);

      const tt = toNext.dot(fromPrev.normal());

      // Same direction => nothing to do
      if (toNext.equals(fromPrev)) continue;

      if (tt === 0) { // Straight (here it goes back)
        if (toNext.x > 0) {
          path += `${cmd} ${corners.tl(pt)} L ${corners.bl(pt)}`;
        } else if (toNext.y < 0) {
          path += `${cmd} ${corners.bl(pt)} L ${corners.br(pt)}`;
        } else if (toNext.x < 0) {
          path += `${cmd} ${corners.br(pt)} L ${corners.tr(pt)}`;
        } else if (toNext.y > 0) {
          path += `${cmd} ${corners.tr(pt)} L ${corners.tl(pt)}`;
        }
      } else if (tt < 0) { // Turn right
        if (toNext.x > 0) {
          path += `${cmd} ${corners.br(pt)}`;
        } else if (toNext.y < 0) {
          path += `${cmd} ${corners.tr(pt)}`;
        } else if (toNext.x < 0) {
          path += `${cmd} ${corners.tl(pt)}`;
        } else if (toNext.y > 0) {
          path += `${cmd} ${corners.bl(pt)}`;
        }
      } else if (tt > 0) { // Turn left
        if (toNext.x > 0) {
          path += `${cmd} ${corners.bl(pt)}`;
        } else if (toNext.y < 0) {
          path += `${cmd} ${corners.br(pt)}`;
        } else if (toNext.x < 0) {
          path += `${cmd} ${corners.tr(pt)}`;
        } else if (toNext.y > 0) {
          path += `${cmd} ${corners.tl(pt)}`;
        }
      }
    }

    return path + 'Z';
  }

  renderFlat(dx: number, dy: number): string {
    let path = '';

    for (const pt of this._points) {
      const cmd = path ? ' L' : 'M';
      path += `${cmd} ${dx + pt.x + .5} ${dy + pt.y + .5}`;
    }

    if (this.length === 1) {
      path += ' Z';
    }

    return path;
  }

  renderIsometric(dx: number, dy: number, z: number): string {
    const w = Math.tan(Math.PI / 3) * .5;
    const h = .5;

    let path = '';

    for (const pt of this._points) {
      const cmd = path ? ' L' : 'M';
      path += `${cmd} ${dx + (pt.x - pt.y) * w} ${dy + (pt.x + pt.y + 1) * h - z}`;
    }

    if (this.length === 1) {
      path += ' Z';
    }

    return path;
  }

  renderFlatZone(dx: number, dy: number): string {
    return this.renderZone({
      tl: pt => `${dx + pt.x    } ${dy + pt.y    }`,
      bl: pt => `${dx + pt.x    } ${dy + pt.y + 1}`,
      br: pt => `${dx + pt.x + 1} ${dy + pt.y + 1}`,
      tr: pt => `${dx + pt.x + 1} ${dy + pt.y    }`
    });
  }

  renderIsometricZone(dx: number, dy: number, z: number): string {
    const w = Math.tan(Math.PI / 3) * .5;
    const h = .5;

    return this.renderZone({
      tl: pt => `${dx + (pt.x - pt.y    ) * w} ${dy + (pt.x + pt.y    ) * h - z}`,
      bl: pt => `${dx + (pt.x - pt.y - 1) * w} ${dy + (pt.x + pt.y + 1) * h - z}`,
      br: pt => `${dx + (pt.x - pt.y    ) * w} ${dy + (pt.x + pt.y + 2) * h - z}`,
      tr: pt => `${dx + (pt.x - pt.y + 1) * w} ${dy + (pt.x + pt.y + 1) * h - z}`
    });
  }

  // Properties
  get points() {
    return Array.from(this._points);
  }

  get length() {
    return this._points.length;
  }
}
