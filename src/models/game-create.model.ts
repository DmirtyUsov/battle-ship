export type GameCreate = {
  idGame: number | string;
  // generated by server id for player in the game session,
  // not enemy (unique id for every player)
  idPlayer: number | string;
};
