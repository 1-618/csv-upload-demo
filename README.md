# csv-upload: heap out of memory demo

A tiny Node upload server that reads a whole CSV into memory, parses every row into an object, and crashes with `JavaScript heap out of memory`. Built to reproduce the opening scene of the JIT-Atlas article in a real Claude Code session.

No dependencies. Needs Node 18 or later.

## Reproduce the crash

1. Generate the test file (about 150 MB, 2 million rows):

   ```sh
   npm run gen
   ```

2. Start the server. The `start` script caps the heap at 128 MB, so the crash happens fast and every time:

   ```sh
   npm start
   ```

3. In a second terminal, upload the file:

   ```sh
   npm run upload
   ```

The server dies with:

```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

and the upload reports `ECONNRESET`.

## Get Claude Code to ask the question

The repo ships a project skill, `.claude/skills/oom-question/SKILL.md`, that scripts the exact question used in the article. Open Claude Code in this folder and run:

```
/oom-question
```

Claude Code reads `server.js`, then asks:

```
How should we fix the out-of-memory crash in the upload handler?

1. Raise the heap limit with --max-old-space-size (Recommended)
2. Stream the file instead of reading it all into memory
3. Move the CSV parsing into a worker thread
```

If `/oom-question` isn't recognised, restart Claude Code from inside this folder, or paste the body of `SKILL.md` (everything below the `---` lines) as a normal message instead.

The question's wording, order and "(Recommended)" pick are fixed by the skill, not chosen by Claude. Each option also shows a one-line description under its label, and the picker adds its own option for typing a custom answer.

For an unscripted run, skip the command, paste the crash output, and ask Claude Code which fix it would pick before it changes anything. Its options and recommendation will vary between sessions.

## Editor theme

`.vscode/settings.json` sets this folder to Bearded Theme Arc Blueberry, with the backgrounds, accent and integrated-terminal colours tuned to the article's palette (indigo `#1f2147`, mint `#5fce98`). VS Code offers to install the theme from `.vscode/extensions.json` the first time the folder is opened. The settings only apply to this folder, so your global theme is untouched.

For Claude Code's UI to pick up the terminal palette, run `/theme` in Claude Code and choose the dark "ANSI colors only" option, if your version has it.

## What each fix actually does

- **Raise the heap limit** (`--max-old-space-size`). The crash goes away, until a bigger file arrives. With a 2 GB heap this file uploads fine.
- **Stream the file.** Parse line by line as the request body arrives, so memory stays flat whatever the file size. This is the real fix.
- **Move parsing into a worker thread.** Keeps the event loop free, but a worker has its own V8 heap, so building every row object there can run out of memory just the same.

## Clean up

`transactions.csv` is about 150 MB. Delete it when you're done.
