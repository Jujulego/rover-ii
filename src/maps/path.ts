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
  private renderZone(corners: Corners): string {
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

  renderFlatZone(dx: number, dy: number): string {
    return this.renderZone({
      tl: pt => `${dx + pt.x    } ${dy + pt.y    }`,
      bl: pt => `${dx + pt.x    } ${dy + pt.y + 1}`,
      br: pt => `${dx + pt.x + 1} ${dy + pt.y + 1}`,
      tr: pt => `${dx + pt.x + 1} ${dy + pt.y    }`
    });
  }

  renderIsometricZone(dx: number, dy: number, z: number): string {
    const w = Math.tan(Math.PI / 3);
    const h = 1;

    return this.renderZone({
      tl: pt => `${dx + (pt.x - pt.y    ) * w * .5} ${dy + (pt.x + pt.y    ) * h * .5 - z}`,
      bl: pt => `${dx + (pt.x - pt.y - 1) * w * .5} ${dy + (pt.x + pt.y + 1) * h * .5 - z}`,
      br: pt => `${dx + (pt.x - pt.y    ) * w * .5} ${dy + (pt.x + pt.y + 2) * h * .5 - z}`,
      tr: pt => `${dx + (pt.x - pt.y + 1) * w * .5} ${dy + (pt.x + pt.y + 1) * h * .5 - z}`
    });
  }

  // Properties
  get length() {
    return this.points.length;
  }
}
