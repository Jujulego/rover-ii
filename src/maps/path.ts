import { Vector } from 'src/utils/math2d';

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

  renderFlatZone(): string {
    // 1 tile path
    if (this.length === 1) {
      const pt = this.points[0];
      return `M ${pt.x} ${pt.y} h 1 v 1 h -1 Z`;
    }

    // Build path
    let path = '';

    for (let i = 0; i < this.length; ++i) {
      const cmd = path ? ' L' : 'M';

      const pt = this.points[i];
      const prev = this.cyclicItem(i - 1);
      const next = this.cyclicItem(i + 1);

      const fromPrev = pt.sub(prev);
      const toNext = next.sub(pt);

      const tt = toNext.dot(fromPrev);
      console.log(`${prev.x},${prev.y} (${fromPrev.x},${fromPrev.y}) => ${pt.x},${pt.y} [${tt}] => ${next.x},${next.y} (${toNext.x},${toNext.y})`);

      if (toNext.equals(fromPrev)) continue;

      if (tt === 0) { // straight (here get back)
        if (toNext.x > 0) {
          path += `${cmd} ${pt.x} ${pt.y} v 1`;
          continue;
        }

        if (toNext.x < 0) {
          path += `${cmd} ${pt.x + 1} ${pt.y + 1} v -1`;
          continue;
        }

        if (toNext.y > 0) {
          path += `${cmd} ${pt.x + 1} ${pt.y} h -1`;
          continue;
        }

        if (toNext.y < 0) {
          path += `${cmd} ${pt.x} ${pt.y + 1} h 1`;
          continue;
        }
      }

      if (tt < 0) { // turn right
        if (toNext.x > 0) {
          path += `${cmd} ${pt.x + 1} ${pt.y + 1}`;
          continue;
        }

        if (toNext.x < 0) {
          path += `${cmd} ${pt.x} ${pt.y}`;
          continue;
        }

        if (toNext.y > 0) {
          path += `${cmd} ${pt.x} ${pt.y + 1}`;
          continue;
        }

        if (toNext.y < 0) {
          path += `${cmd} ${pt.x + 1} ${pt.y}`;
          continue;
        }
      }

      if (tt > 0) { // turn left
        if (toNext.x > 0) {
          path += `${cmd} ${pt.x} ${pt.y + 1}`;
          continue;
        }

        if (toNext.x < 0) {
          path += `${cmd} ${pt.x + 1} ${pt.y}`;
          continue;
        }

        if (toNext.y > 0) {
          path += `${cmd} ${pt.x} ${pt.y}`;
          continue;
        }

        if (toNext.y < 0) {
          path += `${cmd} ${pt.x + 1} ${pt.y + 1}`;
          continue;
        }
      }

      path += `${cmd} ${pt.x + .5} ${pt.y + .5}`;
    }

    return path + 'Z';
  }

  // Properties
  get length() {
    return this.points.length;
  }
}
