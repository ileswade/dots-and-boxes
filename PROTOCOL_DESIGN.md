# Network version planning worksheet

The current game is local. A future network version should be designed by the class before anyone writes socket code. Use this file to record the class agreement.

## Current boundary

- `game.js` owns the rules: legal lines, turns, completed boxes, scores, and game over.
- `app.js` turns browser actions into calls to the rules model and renders the result.
- `server.js` serves static files. It does not accept game messages.

That gives us a clean seam: a network server can accept a message, validate it with the rules model, and broadcast an agreed state or event.

## Questions for the class

1. What is the smallest action a client needs to send? For example, is it a line orientation plus row and column?
2. Who assigns player identities and turn order?
3. Does the server send the complete state after every valid action, or only events such as `line_drawn` and `box_claimed`?
4. What encoding will we use: JSON text, a compact text format, or binary data?
5. How does a client know that a message is valid, duplicated, out of order, or from the wrong player?
6. How do we represent a new game, a player joining, a player leaving, and a finished game?
7. What errors are safe to show to a user, and what errors are only useful for debugging?

## Layering lens

Use the same message to discuss three different responsibilities:

| Layer | Class question | Example decision |
| --- | --- | --- |
| Application | What does a game action mean? | `draw_line` means a player requests one specific edge. |
| Presentation | How are that meaning and its data represented? | JSON with a `type`, an orientation, a row, and a column. |
| Session | How do two participants establish and maintain a game? | Join a game, assign a player, enforce turn order, and reconnect or leave cleanly. |

Keeping these questions separate makes it easier to change an encoding without changing the rules, or to change the connection lifecycle without changing what a completed box means.

## Draft message table

Replace these examples with the class decision. Do not treat them as a finished protocol.

| Direction | Message | Required fields | Meaning |
| --- | --- | --- | --- |
| client → server | `join` | `game_id`, `name` | Ask to join a game. |
| client → server | `draw_line` | `orientation`, `row`, `column` | Request one line. |
| server → clients | `state` | `turn`, `scores`, `lines`, `boxes` | Authoritative current state. |
| server → client | `error` | `code`, `message` | Explain why a request was rejected. |
| server → clients | `game_over` | `scores`, `winner` | Announce the final result. |

## Example encoding to critique

```json
{
  "type": "draw_line",
  "request_id": "42",
  "orientation": "horizontal",
  "row": 1,
  "column": 3
}
```

Before implementing this example, agree on whether rows and columns are zero-based or one-based, whether `request_id` is required, and whether the server returns a complete state or an event stream.

## Decision record

| Decision | Class agreement | Reason | Date |
| --- | --- | --- | --- |
| Encoding | _Fill in_ | _Fill in_ | _Fill in_ |
| Presentation message shape | _Fill in_ | _Fill in_ | _Fill in_ |
| Session and identity | _Fill in_ | _Fill in_ | _Fill in_ |
| Error handling | _Fill in_ | _Fill in_ | _Fill in_ |
