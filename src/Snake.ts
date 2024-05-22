// import display from "./display";
import { timeStamp } from "console";
import { get } from "https";
import { Interface } from "readline";
import display from "./display";

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
    return this.snakeWorld.allSnakes;
  }

  get worldHeight() {
    return this.snakeWorld.allViews;
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
    const worldHeight = 30;

    if (
      snakeDirection === "left" &&
      snakePosition.x === 0 &&
      snakePosition.y < worldHeight
    ) {
      this.sc.LSnaketurn();
    }
  }
}

interface IWorldView {
  display(WorldModel: WorldModel): void;
  update(model: WorldModel): void;
}

class CanvasWorldView implements IWorldView {
  private scalingFactor: number;
  private worldCanvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  constructor(scalingFactor: number) {
    this.scalingFactor = scalingFactor;
    this.worldCanvas = document.createElement("canvas");
    this.context = this.worldCanvas.getContext("2d")!;
    document.body.appendChild(this.worldCanvas);
  }

  display(WorldModel: WorldModel): void {
    this.worldCanvas.width = 30 * this.scalingFactor;
    this.worldCanvas.height = 40 * this.scalingFactor;
    this.context.fillStyle = "orange";
    this.context.fillRect(
      0,
      0,
      this.worldCanvas.width,
      this.worldCanvas.height,
    );

    for (const snake of WorldModel.allSnakes) {
      for (const part of snake.currentParts) {
        this.context.fillStyle = "green";
        this.context.fillRect(
          part.x * this.scalingFactor,
          part.y * this.scalingFactor,
          this.scalingFactor,
          this.scalingFactor,
        );
      }
    }
  }

  update(model: WorldModel): void {}
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

  equals(p: Point): boolean {
    return this.x === p.x && this.y === p.y;
  }
}

type Direction = "left" | "right" | "up" | "down";

class Snake {
  public currentParts: Point[];
  public currentDirection: Direction; // changed from private to protected

  constructor(startPosition: Point, size: number) {
    this.currentParts = [startPosition];
    for (let i = 1; i < size; i++) {
      const tailPart = new Point(startPosition.x, startPosition.y + i);
      this.currentParts.push(tailPart);
    }
    this.currentDirection = "up";
  }

  move(distance: number) {
    for (let i = this.currentParts.length - 1; i > 0; i--) {
      this.currentParts[i] = this.currentParts[i - 1];
    }

    const head = this.currentParts[0];
    let newHead: Point;

    if (this.currentDirection === "up") {
      newHead = new Point(head.x, head.y - distance);
    } else if (this.currentDirection === "right") {
      newHead = new Point(head.x + distance, head.y);
    } else if (this.currentDirection === "down") {
      newHead = new Point(head.x, head.y + distance);
    } else if (this.currentDirection === "left") {
      newHead = new Point(head.x - distance, head.y);
    } else {
      throw new Error("Invalid direction");
    }
    this.currentParts[0] = newHead;
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
    return this.currentParts[0];
  }

  collidesWith(otherSnake: Snake): boolean {
    const head = this.currentParts[0];
    const otherParts = otherSnake.currentParts;
    return otherParts.some((part) => part.equals(head));
  }

  didCollide(s: Snake): boolean {
    const head = this.currentParts[0];
    const otherParts = this.currentParts.slice(1);
    return otherParts.some((part) => part.equals(head));
  }
}

class WorldModel {
  public allSnakes: Snake[] = [];
  public allViews: IWorldView[] = [];

  constructor() {}

  addSnake(s: Snake): void {
    this.allSnakes.push(s);
  }

  addView(v: IWorldView): void {
    this.allViews.push(v);
  }

  update(steps: number): void {
    const collidedSnakes: Snake[] = [];
    for (let i = 0; i < this.allSnakes.length; i++) {
      const snakeA = this.allSnakes[i];
      for (let j = i + 1; j < this.allSnakes.length; j++) {
        const snakeB = this.allSnakes[j];
        if (snakeA.collidesWith(snakeB) && !collidedSnakes.includes(snakeA)) {
          collidedSnakes.push(snakeA);
        }
      }
    }

    for (const collidedSnake of collidedSnakes) {
      const index = this.allSnakes.indexOf(collidedSnake);
      if (index !== -1) {
        this.allSnakes.splice(index, 1);
      }
    }

    for (const snake of this.allSnakes) {
      snake.move(steps);
    }

    for (const view of this.allViews) {
      view.update(this);
    }
  }

  get snakes(): Snake[] {
    return this.allSnakes;
  }
}

interface IInuptHandler {
  madeleftMove(): boolean;
  madeRightMove(): boolean;
  resetLeftMove(): void;
  resetRightMove(): void;
}

class LRKeyInputHandler implements IInuptHandler {
  private wasLeftArrowPushed: boolean = false;
  private wasRightArrowPushed: boolean = false;

  constructor() {
    window.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        this.wasLeftArrowPushed = true;
      } else if (event.key === "ArrowRight") {
        this.wasRightArrowPushed = true;
      }
    });
  }

  madeleftMove(): boolean {
    return this.wasLeftArrowPushed;
  }

  madeRightMove(): boolean {
    return this.wasRightArrowPushed;
  }

  resetLeftMove(): void {
    this.wasLeftArrowPushed = false;
  }

  resetRightMove(): void {
    this.wasRightArrowPushed = false;
  }
}

class HumanPlayer extends Player {
  private snakeController: SnakeController;
  private inputHandler: IInuptHandler;

  constructor(snakeController: SnakeController, inputHandler: IInuptHandler) {
    super(snakeController);
    this.snakeController = snakeController;
    this.inputHandler = inputHandler;
  }

  makeTurn(): void {
    if (this.inputHandler.madeleftMove()) {
      this.snakeController.LSnaketurn();
      this.inputHandler.resetLeftMove();
    } else if (this.inputHandler.madeRightMove()) {
      this.snakeController.RSnaketurn();
      this.inputHandler.resetRightMove();
    }
  }
}

class GameController {
  private world: WorldModel;
  private player1: Player | null = null;
  private player2: Player | null = null;

  constructor(world: WorldModel) {
    this.world = world;
  }

  setPlayer1(player: Player): void {
    this.player1 = player;
  }

  setPlayer2(player: Player): void {
    this.player2 = player;
  }

  run(): void {
    let lastTime = 0;

    const updateFrame = (timeStamp: number) => {
      const elapsedMillieseconds = timeStamp - lastTime;
      if (elapsedMillieseconds > 250) {
        this.world.update(1);
        lastTime += 250;
      }
      requestAnimationFrame(updateFrame);
    };
    requestAnimationFrame(updateFrame);
  }
}

export default Snake;
