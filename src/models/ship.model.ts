type Size = 'small' | 'medium' | 'large' | 'huge';

type Position = {
  x: number;
  y: number;
};

export type Ship = {
  position: Position;
  direction: boolean;
  length: number;
  type: Size;
};
