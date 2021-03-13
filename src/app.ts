const robot = require('robotjs');

interface Point {
  x: number;
  y: number;
}

const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const limitNumberToRange = (number: number, min: number, max: number): number => {
  return Math.min(Math.max(number, min), max);
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const getPointOnLine = (from: Point, to: Point, t: number): Point => {
  return {
    x: (1 - t) * from.x + t * to.x,
    y: (1 - t) * from.x + t * to.y,
  };
};

const cubicBezier = (a: number, b: number, c: number, d: number, t: number): number => {
  return (
    Math.pow(1 - t, 3) * a + 3 * t * Math.pow(1 - t, 2) * b + 3 * Math.pow(t, 2) * (1 - t) * c + Math.pow(t, 3) * d
  );
};

const moveToXY = async (to: Point) => {
  const mousePos = robot.getMousePos();

  const from: Point = { x: mousePos.x, y: mousePos.y };

  console.log(`Moving from ${from.x}, ${from.y} to ${to.x}, ${to.y}`);

  // pythagoras
  const distance = parseInt(Math.sqrt(Math.pow(from.x - to.y, 2) + Math.pow(from.x - to.x, 2)).toFixed(0));

  console.log(`Distance = ${distance}`);

  // 2 random offset points
  const offsetA = getPointOnLine(from, to, randomNumber(0.15, 0.4));
  const offsetB = getPointOnLine(from, to, randomNumber(0.9, 1.05));

  // offset points randomly
  offsetA.y += limitNumberToRange(randomNumber(-distance / 4, distance / 4), -100, 100);
  offsetB.x += limitNumberToRange(randomNumber(-distance / 4, distance / 4), -100, 100);

  const step = 0.018;

  for (let t = 0; t <= 1; t += step) {
    const currentPoint: Point = {
      x: cubicBezier(from.x, offsetA.x, offsetB.x, to.x, t),
      y: cubicBezier(from.y, offsetA.y, offsetB.y, to.y, t),
    };

    robot.moveMouse(currentPoint.x, currentPoint.y);

    const speed = Math.pow(cubicBezier(0.55, 0.09, 0, 0.99, t) * 1.3, 20);

    await sleep(speed);
  }
};

moveToXY({ x: 500, y: 500 });
