const top = 0;
const parent = (i: number) => ((i + 1) >>> 1) - 1;
const left = (i: number) => (i << 1) + 1;
const right = (i: number) => (i + 1) << 1;

export class PriorityQueue<T> {
  private heap: T[];
  constructor(private comparator: (a: T, b: T) => boolean) {
    this.heap = [];
  }

  get size(): number {
    return this.heap.length;
  }

  isEmpty(): boolean {
    return this.size == 0;
  }

  peek(): T {
    return this.heap[top];
  }

  push(...vals: T[]) {
    vals.forEach(val => {
      this.heap.push(val);
      this.siftUp();
    });
  }

  pop(): T {
    const poppedVal = this.peek();

    const bottom = this.size - 1;
    if (bottom > top) {
      this.swap(top, bottom);
    }
    this.heap.pop();
    this.siftDown();

    return poppedVal;
  }

  private greater(i: number, j: number): boolean {
    return this.comparator(this.heap[i], this.heap[j]);
  }

  private swap(i: number, j: number): void {
    const tmp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = tmp;
  }

  private siftUp() {
    let node = this.size - 1;
    while (node > top && this.greater(node, parent(node))) {
      this.swap(node, parent(node));
      node = parent(node);
    }
  }

  private siftDown() {
    let node = top;
    while (
      (left(node) < this.size && this.greater(left(node), node)) ||
      (right(node) < this.size && this.greater(right(node), node))
    ) {
      let maxChild =
        right(node) < this.size && this.greater(right(node), left(node))
          ? right(node)
          : left(node);
      this.swap(node, maxChild);
      node = maxChild;
    }
  }
}
