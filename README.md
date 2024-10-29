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
- **My bad!** I missed the rule: If player hits or kills the ship, player should make one more shoot.  
In the current version, a turn is made after each attack. This is easy to fix.  But it will be commit after deadline.  
To fast check you can set `DEV_ATTACKS_BEFORE_FORCE_GAME_OVER=3` in `.env`. The game ends after three attacks by either player.
