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

interface IWorldView {
  display(WorldModel: WorldModel): void;
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
    this.worldCanvas.width = WorldModel.width * this.scalingFactor;
    this.worldCanvas.height = WorldModel.height * this.scalingFactor;
    this.context.fillStyle = "orange";
    this.context.fillRect(0, 0, this.scalingFactor, this.scalingFactor);
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
  worldView: IWorldView | null = null;

  constructor(snake: Snake, width: number, height: number) {
    this.snake = snake;
    this.width = width;
    this.height = height;
  }

  update(steps: number): void {
    this.snake.move(steps);
    if (this.worldView) {
      this.worldView.display(this);
    }
  }

  setView(view: IWorldView): void {
    this.worldView = view;
  }

  get snakeInstance(): Snake {
    return this.snake;
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
