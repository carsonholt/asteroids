// Vector class

export function add(a, b) {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  }
}

export function subtract(a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  }
}

export function dotProduct(a, b) {
  return a.x * b.x + a.y + b.y;
}

export function magnitude(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y);
}

export function normalize(a) {
  var mag = magnitude(a);
  return {
    x: a.x / mag,
    y: a.y / mag
  }
}

export function perpendicular(a) {
  return {
    x: -a.y,
    y: a.x
  }
}