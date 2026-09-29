# Future networking extension

This student version is intentionally complete as a local game and intentionally incomplete as a networked game.

Do not add WebSocket or TCP code until the class has agreed on the protocol. When the networking project begins, keep the existing local rules intact and add the new pieces around them:

```text
browser input → action message → server-side Game → state/event message → browser rendering
```

The current code already gives us the useful boundaries:

- `game.js` owns legal moves, turns, scores, completed boxes, and game over.
- `app.js` translates browser controls into `game.play(...)` calls and renders state.
- `server.js` serves the local files only; it is not a game server.
- `test/game.test.js` protects the rules while the transport is designed.

When the class later adds networking, students can decide whether to add a `server/` directory, a `protocol/` directory, or both. The first protocol decisions belong in `PROTOCOL_DESIGN.md` before implementation:

1. What does a move mean on the wire?
2. Which side owns the authoritative state?
3. How are rows, columns, players, errors, and request IDs encoded?
4. How does a session start, continue, reconnect, and end?

The teacher reference implementation lives outside this repository at `/Users/ileswade/ris/dev/dotsandboxes-network`. It is not imported by this app and should not be copied into the student starter before the class design work is complete.
