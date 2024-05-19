// import display from "./display";
import { get } from "https";

class SnakeController {
  private snakeWorld: WorldModel;
  private slither: Snake;

  constructor(snakeWorld: WorldModel, slither: Snake) {
    this.snakeWorld = snakeWorld;
    this.slither = slither;
  }

  LSnaketurn(): void {
    this.slither.turnLeft();
  }

  RSnaketurn(): void {
    this.slither.turnRight();
  }

  get snakePosition(): Point {
    return this.slither.Position;
  }

  get snakeDirection(): Direction {
    return this.slither.currentDirection;
  }

  get worldWidth() {
    return this.snakeWorld.width;
  }

  get worldHeight() {
    return this.snakeWorld.height;
  }
}

abstract class Player {
  protected sc: SnakeController;

  constructor(sc: SnakeController) {
    this.sc = sc;
  }

  abstract makeTurn(): void;
}

class AvoidWallsPlayer extends Player {
  constructor(sc: SnakeController) {
    super(sc);
  }

  makeTurn(): void {
    const snakeDirection = this.sc.snakeDirection;
    const snakePosition = this.sc.snakePosition;
    const worldHeight = this.sc.worldHeight;
    if (
      snakeDirection === "left" &&
      snakePosition.x === 0 &&
      snakePosition.y < worldHeight
    ) {
      this.sc.LSnaketurn();
    }
  }
}

class Point {
  private readonly xcoord: number;
  public readonly ycoord: number;

  constructor(x: number, y: number) {
    this.xcoord = x;
    this.ycoord = y;
  }

  get x(): number {
    return this.xcoord;
  }

  get y(): number {
    return this.ycoord;
  }
}

type Direction = "left" | "right" | "up" | "down";

class Snake {
  private currentPosition: Point;
  public currentDirection: Direction; // changed from private to protected

  constructor() {
    this.currentPosition = new Point(0, 0);
    this.currentDirection = "up";
  }

  move(distance: number) {
    let NX = this.currentPosition.x;
    let NY = this.currentPosition.y;

    if (this.currentDirection === "up") NY += distance;
    else if (this.currentDirection === "right") NX -= distance;
    else if (this.currentDirection === "down") NY += distance;
    else if (this.currentDirection === "left") NX -= distance;

    this.currentPosition = new Point(NX, NY);
  }

  turnLeft() {
    if (this.currentDirection === "up") this.currentDirection = "left";
    else if (this.currentDirection === "right") this.currentDirection = "up";
    else if (this.currentDirection === "down") this.currentDirection = "right";
    else if (this.currentDirection === "left") this.currentDirection = "down";
  }

  turnRight() {
    if (this.currentDirection === "up") this.currentDirection = "right";
    else if (this.currentDirection === "right") this.currentDirection = "down";
    else if (this.currentDirection === "down") this.currentDirection = "left";
    else if (this.currentDirection === "left") this.currentDirection = "up";
  }

  get Position(): Point {
    return this.currentPosition;
  }
}

class WorldModel {
  private snake: Snake;
  width: number;
  height: number;

  constructor(snake: Snake, width: number, height: number) {
    this.snake = snake;
    this.width = 1;
    this.height = 1;
  }

  update(steps: number): void {
    this.snake.move(steps);
  }

  get snakeInstance(): Snake {
    return this.snake;
  }
}

export default Snake;
