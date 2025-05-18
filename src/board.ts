import { Position, Ship } from './models';

const GRID_SIZE = 10;
type ShipPartsOnBoardHit = Record<number, boolean>;

export class Board {

  private indexesWithShipParts = new Map<number, ShipPartsOnBoardHit>();
  
  constructor(
    ships: Ship[],
    private gridSize: number = GRID_SIZE
  ) {
    this.placeShips(ships);
  }

  placeShips(ships: Ship[]): void {
    ships.forEach((ship) => this.placeShip(ship));
  }

  private placeShip(ship: Ship) {
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

  private static convertPosition2Index(
    position: Position,
    gridSize: number
  ): number {
    const { x, y } = position;
    return y * gridSize + x;
  }
}
