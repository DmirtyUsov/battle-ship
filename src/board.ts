import {
  AttackFeedback,
  AttackStatus,
  Position,
  Ship,
} from './models/index.js';

type ShipPartsOnBoardHit = { [index: number]: boolean };
type AttackFeedbackButPlayer = Omit<AttackFeedback, 'currentPlayer'>;
type IndexWithAttackStatus = { index: number; status: AttackStatus };

export class Board {
  private indexesWithShipParts = new Map<number, ShipPartsOnBoardHit>();
  private tempAttacksBeforeFinish: number = 3;

  constructor(ships: Ship[], private gridSize: number) {
    this.placeShips(ships);
  }

  private static convertPosition2Index(
    position: Position,
    gridSize: number,
  ): number {
    const { x, y } = position;
    return y * gridSize + x;
  }

  private static convertIndex2Position(
    idx: number,
    gridSize: number,
  ): Position {
    const x = idx % gridSize;
    const y = (idx - x) / gridSize;
    return { x, y };
  }

  static getRandomPosition(gridSize: number): Position {
    const min = 0;
    const max = gridSize;
    const idx = Math.floor(Math.random() * (max - min) + min);
    return Board.convertIndex2Position(idx, gridSize);
  }

  private placeShips(ships: Ship[]): void {
    ships.forEach((ship) => this.placeShipOnBoard(ship));
  }

  private placeShipOnBoard(ship: Ship) {
    const { position, length, direction: isVertical } = ship;
    const shipLengthIndexes = [...Array(length).keys()];
    const startIndex = Board.convertPosition2Index(position, this.gridSize);

    const cellAmend = isVertical ? this.gridSize : 1;

    const shipOnBoard: ShipPartsOnBoardHit = {};
    const shipCells: number[] = [];

    shipLengthIndexes.forEach((idx) => {
      const cell: number = startIndex + idx * cellAmend;
      shipOnBoard[cell] = false;
      shipCells.push(cell);
    });

    shipCells.forEach((index: number) => {
      this.indexesWithShipParts.set(index, shipOnBoard);
    });
  }

  private hitCell(index: number): IndexWithAttackStatus[] {
    let status: AttackStatus;
    const shipPartsHit = this.indexesWithShipParts.get(index);
    this.tempAttacksBeforeFinish--;

    if (!shipPartsHit) {
      status = 'miss';
      return [{ index, status }];
    }

    const isHitBefore = shipPartsHit[index];
    if (isHitBefore) {
      status = 'miss';
      return [{ index, status }];
    }
    shipPartsHit[index] = true;
    status = 'shot';

    const shipIndexes = Object.keys(shipPartsHit);
    const isKilled = shipIndexes.every((idx) => shipPartsHit[+idx] === true);

    if (isKilled) {
      status = 'killed';
      const results: IndexWithAttackStatus[] = [];

      shipIndexes.forEach((idx) => {
        results.push({ index: +idx, status });
        this.indexesWithShipParts.delete(+idx);
      });
      return results;
    }

    return [{ index, status }];
  }

  attack(position: Position): AttackFeedbackButPlayer[] {
    const index = Board.convertPosition2Index(position, this.gridSize);

    const attackScores = this.hitCell(index);

    const feedbacks = attackScores.map(({ index, status }) => {
      const position = Board.convertIndex2Position(index, this.gridSize);
      return { position, status };
    });

    return feedbacks;
  }

  checkNoShipsOnBoard(): boolean {
    return (
      this.indexesWithShipParts.size === 0 || this.tempAttacksBeforeFinish === 0
    );
  }
}
