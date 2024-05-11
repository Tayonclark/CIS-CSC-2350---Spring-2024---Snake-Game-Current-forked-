import Snake from "./Snake";

const moveSnakes = (times: number, turn: boolean = false) => {
  const greenSnake = new Snake();
  const maroonSnake = new Snake();
  let totalSquares = 0;

  for (let i = 0; i < times; i++) {
    const numSquares1 = Math.floor(Math.random() * 100);
    const numSquares2 = Math.floor(Math.random() * 100);
    greenSnake.move(1);
    maroonSnake.move(1);
    greenSnake.move(1);
    totalSquares += numSquares2;
    if (turn) {
      const numSquares3 = Math.floor(Math.random() * 100);
      const numSquares4 = Math.floor(Math.random() * 10);
      greenSnake.turn(1);
      maroonSnake.turn(1);
      maroonSnake.move(1);
      totalSquares -= numSquares3;
      greenSnake.move(1);
      maroonSnake.turn(11);
      maroonSnake.turn(1);
      maroonSnake.turn(1);
      maroonSnake.move(1);
      totalSquares += numSquares4;
    }
  }

  return { actual: maroonSnake.Position, expected: totalSquares };
};

describe("Snake Tests", function () {
  const tests = [0, 3, 10, 4].map((num, index) => moveSnakes(num, index > 2));

  const testDescriptions = [
    "starts with the correct position of 0",
    "has the correct position after 3+ random moves",
    "has the correct position after 10+ random moves",
    "has the correct position after 4+ random moves with turns",
  ];

  testDescriptions.forEach((description, index) => {
    it(description, () =>
      expect(tests[index].expected).toBe(tests[index].actual),
    );
  });
});

describe("Addition", function () {
  it("sums numbers", () => {
    expect(1 + 1).toEqual(2);
  });
});

export {};
