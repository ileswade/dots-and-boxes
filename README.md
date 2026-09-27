# Dots & Boxes: local JavaScript starter

This is a small, dependency-free Dots & Boxes game for two people sharing one computer. It is a teaching starter for the networking unit: students can clone it, run it with Node, play a complete game, and then propose the messages and encoding they would need for a networked version.

The starter intentionally has no WebSocket, HTTP API, database, login, or multiplayer-server code. The only server is a tiny static file server so the browser can load the game locally.

## Requirements

- Node.js 20 or newer
- Git
- VS Code (recommended)

Check the installations in a terminal:

```text
node --version
git --version
```

## Download and run

Clone the repository and enter its folder:

```bash
git clone https://github.com/ileswade/dots-and-boxes.git
cd dots-and-boxes
```

There are no third-party packages to install. Run the tests, then start the local server:

```bash
npm test
npm start
```

Open <http://127.0.0.1:4173/> in a browser. Leave the terminal running while you play. Stop the server with `Ctrl+C`.

To open the project in VS Code:

```bash
code .
```

## Where to make changes

| File | Responsibility | Good first experiment |
| --- | --- | --- |
| `game.js` | Pure rules and board state. No DOM and no networking. | Change board rules or add a new state value. |
| `app.js` | Browser presentation and user interaction. | Add a status panel, keyboard controls, or a different board layout. |
| `index.html` | Page structure and accessible controls. | Add an explanation or new form control. |
| `style.css` | Visual presentation and responsive layout. | Try a new visual theme. |
| `server.js` | Local static file server only. | Add a route or inspect how a browser request is served. |
| `test/game.test.js` | Executable examples of the rules. | Add a test before changing a rule. |
| `PROTOCOL_DESIGN.md` | Class worksheet for the future network version. | Propose message names, fields, and encoding. |

Keep the rules model independent from the browser. That separation is the useful starting point for a later network version: a server could own a `Game`, while clients send intentional actions and render state updates.

## Suggested student workflow

1. Run the unmodified game and play a short round.
2. Read `game.js` and `test/game.test.js` before changing behaviour.
3. Make one small change on a branch.
4. Run `npm test` and play the game again.
5. Record the proposed network messages in `PROTOCOL_DESIGN.md`.

The starter is deliberately small enough to understand in one class and structured enough to grow into the network protocol project.

## License

Use this starter for the course and adapt it for your project. See the repository history for the exact version used in class.
