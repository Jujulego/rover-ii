import { Vector } from 'src/utils/math2d';

// Types
type Corner = 'tl' | 'bl' | 'br' | 'tr';
type Corners = Record<Corner, (pt: Vector) => string>;

// Class
export class Path {
  // Attributes
  points: Vector[] = [];

  // Methods
  cyclicItem(idx: number): Vector {
    while (idx < 0) idx += this.length;
    return this.points[idx % this.length];
  }

  push(u: Vector) {
    this.points.push(u);
  }

  // - rendering
  private render(corners: Corners): string {
    // no tiles
    if (this.length === 0) {
      return '';
    }

    // 1 tile path
    if (this.length === 1) {
      const pt = this.points[0];
      return `M ${corners.tl(pt)} L ${corners.bl(pt)} L ${corners.br(pt)} L ${corners.tr(pt)} Z`;
    }

    // Build path
    let path = '';

    for (let i = 0; i < this.length; ++i) {
      const cmd = path ? ' L' : 'M';

      // Get points
      const pt = this.points[i];
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

  renderFlatZone(): string {
    return this.render({
      tl: pt => `${pt.x} ${pt.y}`,
      bl: pt => `${pt.x} ${pt.y + 1}`,
      br: pt => `${pt.x + 1} ${pt.y + 1}`,
      tr: pt => `${pt.x + 1} ${pt.y}`
    });
  }

  // Properties
  get length() {
    return this.points.length;
  }
}
