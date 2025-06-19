# Treasure Vault Mini-Game

A fun and interactive vault unlocking mini-game built with PIXI.js and GSAP. Players must rotate a vault handle in the correct direction and number of times to unlock the vault and reveal the treasure with a beautiful glitter effect.

## Features

- **Interactive Vault Handle**: Click to rotate the handle clockwise or counterclockwise
- **Responsive Design**: Works on different screen sizes

## Installation

1. **Clone the repository** (if you haven't already):
```bash
git clone https://github.com/eqinox/Treasure-Vault-Mini-Game.git
cd Treasure-Vault-Mini-Game
```

2. **Install dependencies**:
```bash
npm install
```

## Running the Project

```bash
npm run start
```

## How to Play

1. **Start the Game**: The vault will generate a random combination
2. **Check the Console**: Open browser developer tools (F12) to see the combination
3. **Rotate the Handle**: Click the vault handle to rotate it:
   - **Clockwise**: Rotates the handle clockwise
   - **Counterclockwise**: Rotates the handle counterclockwise
4. **Follow the Combination**: 
   - Each combination has a direction (clockwise/counterclockwise)
   - And a number (how many times to rotate in that direction)
5. **Unlock the Vault**: When you complete the combination correctly, the vault will open
7. **Reset**: After 5 seconds, the vault will close and a new combination will be generated