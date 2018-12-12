let bin_heap;
let n;
let less;

const init = compareFunction => {
  bin_heap = [];
  n = 0;
  less = compareFunction;
};

const isEmpty = () => {
  return n === 0;
};

const bh_size = () => {
  return n;
};

const swim = k => {
  while (k > 1 && less(k / 2, k)) {
    exch(k, k / 2);
    k = k / 2;
  }
};

const sink = k => {
  while (2 * k <= n) {
    let j = 2 * k;
    if (j < n && less(j, j + 1)) j++;
    if (!less(k, j)) break;
    exch(k, j);
    k = j;
  }
};

const insert = x => {
  n++;
  console.log(n);
  bin_heap[n] = x;
  //console.log(bin_heap[n]);
  //bin_heap.push(x);
  swim(n);
};

const delMax = () => {
  let k = bin_heap[1];
  bin_heap[1] = bin_heap[n];
  n--;
  sink(1);
  return k;
};

const exch = (i, j) => {
  let swap = bin_heap[i];
  bin_heap[i] = bin_heap[j];
  bin_heap[j] = swap;
};

exports.init = init;
exports.insert = insert;
exports.isEmpty = isEmpty;
exports.bh_size = bh_size;
exports.delMax = delMax;
