export function deleteFromArray (array, item) {
    if (array.indexOf(item) < 0) return array;
    return array.slice(0, array.indexOf(item)).concat(array.slice(array.indexOf(item) + 1));
  }
export var debug = true;