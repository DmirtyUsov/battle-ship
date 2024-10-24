export enum Signals {
  REG = 'reg',
  UPDATE_WINNERS = 'update_winners',
  UPDATE_ROOM = 'update_room',
  CREATE_ROOM = 'create_room',
  ADD_USER_TO_ROOM = 'add_user_to_room',
  CREATE_GAME = 'create_game',
  ADD_SHIPS = 'add_ships',
  START_GAME = 'start_game',
  TURN = 'turn',
  ATTACK = 'attack',
  FINISH = 'finish',
  RANDOM_ATTACK = 'randomAttack',
  SINGLE_PLAY = 'single_play',
  NOT_GET_IT='error',
}

export type Command<T> ={
  type: Signals;
  data: T;
  id: number;
}