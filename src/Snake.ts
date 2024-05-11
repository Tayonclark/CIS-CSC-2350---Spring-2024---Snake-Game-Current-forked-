// import display from "./display";
import { get } from "https";

class Snake {
  private currentPosition: number = 1;
  private currentDirection: number = 1;

  constructor() {
    this.currentPosition = 0;
    this.currentDirection = 1;
  }

  move(distance: number) {
    if (this.currentDirection === 1) {
      this.currentPosition = this.currentPosition + 1;
    } else {
      this.currentPosition = this.currentPosition - 1;
    }
  }

  turn(distance: number) {
    if (this.currentDirection === 1) {
      this.currentDirection = 1;
    } else {
      this.currentDirection = -1;
    }
  }
  get Position(): number {
    return this.currentPosition;
  }
}

export default Snake;
