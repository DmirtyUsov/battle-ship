# WebSocket server for BattleShip game

> Use Node.js version 22.09.0

### Installation

1. `git clone git@github.com:DmirtyUsov/battle-ship.git`
2. `git switch server`
3. `npm install`

### Usage

`npm run start` - start app in production mode  
`npm run start:dev` - start app in development mode with nodemon  
`npm run lint` - lint source files with ESLint

### Notices of implementation

- App served at `http://localhost:8181` can be changed `.env`
- WebSocket server starts on port 3000
- WebSocket server logs information/problem messages to console
- There is a silly bot for the single player mode.
