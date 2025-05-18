# Phaser 3 Game Starter

This project provides a minimal Phaser 3 setup using ES modules with no bundler.

## Getting Started

1. Install a static file server if you don't have one. One option is [`http-server`](https://www.npmjs.com/package/http-server):

   ```bash
   npm install -g http-server
   ```

2. Start the server from the project directory:

   ```bash
   http-server -c-1
   ```

3. Open `http://localhost:8080` in your browser to run the game.

You can also use any other static server (for example `python3 -m http.server`).

## Project Structure

- `index.html` – loads Phaser from CDN and boots `MainScene`.
- `src/main.js` – defines `MainScene` with a scrolling background, player movement and shooting.
- `src/enemy.js` – simple downward moving enemy class.
- `assets/` – placeholder directory for game assets.

Feel free to replace the placeholder images in `assets/` with your own artwork.
