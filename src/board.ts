import { AttackFeedbackDTO, AttackStatus, Position, Ship } from './models';

const GRID_SIZE = 10;
type ShipPartsOnBoardStatus = Record<number, AttackStatus>;
type HitCellResult = { index: number; status: AttackStatus };

export class Board {
  private indexesWithShipParts = new Map<number, ShipPartsOnBoardStatus>();
  private countShipsRemain = 0;
  private randomCellsForAttacks: number[];

  constructor(
    ships: Ship[],
    private gridSize: number = GRID_SIZE
  ) {
    this.placeShips(ships);
    this.countShipsRemain = ships.length;
    this.randomCellsForAttacks = Board.makeRandomCells(gridSize);
  }

  placeShips(ships: Ship[]): void {
    ships.forEach((ship) => this.placeShip(ship));
  }

  private placeShip(ship: Ship) {
    const { position, length, direction: isVertical } = ship;
    const shipLengthIndexes = [...Array(length).keys()];
    const startIndex = Board.convertPosition2Index(position, this.gridSize);

    const cellAmend = isVertical ? this.gridSize : 1;

    const shipOnBoard: ShipPartsOnBoardStatus = {};
    const shipCells: number[] = [];

    shipLengthIndexes.forEach((idx) => {
      const cell: number = startIndex + idx * cellAmend;
      shipOnBoard[cell] = 'miss';
      shipCells.push(cell);
    });

    shipCells.forEach((index: number) => {
      this.indexesWithShipParts.set(index, shipOnBoard);
    });
  }

  private static convertPosition2Index(
    position: Position,
    gridSize: number
  ): number {
    const { x, y } = position;
    return y * gridSize + x;
  }

  private static convertIndex2Position(
    idx: number,
    gridSize: number
  ): Position {
    const x = idx % gridSize;
    const y = (idx - x) / gridSize;
    return { x, y };
  }

  private static makeRandomCells(gridSize: number): number[] {
    const cells = [...Array(gridSize ** 2).keys()];
    cells.sort(() => Math.random() - 0.5);
    return cells;
  }

  getRandomPosition(): Position {
    const idx = this.randomCellsForAttacks.pop();
    return Board.convertIndex2Position(idx || 0, this.gridSize);
  }

  private hitCell(index: number): HitCellResult[] {
    let status: AttackStatus;
    const shipOnBoardPartsStatus = this.indexesWithShipParts.get(index);

    if (!shipOnBoardPartsStatus) {
      status = 'miss';
      return [{ index, status }];
    }

    if (shipOnBoardPartsStatus[index] !== 'miss') {
      status = 'miss';
      return [{ index, status }];
    }

    shipOnBoardPartsStatus[index] = 'shot';
    status = 'shot';

    const shipAllIndexes = Object.keys(shipOnBoardPartsStatus);

    const isKilled = shipAllIndexes.every(
      (idx) => shipOnBoardPartsStatus[+idx] === 'shot'
    );

    if (isKilled) {
      const result: HitCellResult[] = [];

      shipAllIndexes.forEach((idx) => {
        const cell = +idx;
        shipOnBoardPartsStatus[cell] = 'killed';
        result.push({ index: cell, status: 'killed' });
      });
      this.countShipsRemain += -1;
      return result;
    }

    return [{ index, status }];
  }

  checkNoMoreShips(): boolean {
    return this.countShipsRemain === 0;
  }

  attack(position: Position): AttackFeedbackDTO[] {
    const currentPlayer = 'temporary for attack';
    const index = Board.convertPosition2Index(position, this.gridSize);

    const attackResults: HitCellResult[] = this.hitCell(index);

    const feedbacks: AttackFeedbackDTO[] = attackResults.map(
      ({ index, status }) => {
        const position = Board.convertIndex2Position(index, this.gridSize);
        return { currentPlayer, position, status };
      }
    );

    return feedbacks;
  }
}
