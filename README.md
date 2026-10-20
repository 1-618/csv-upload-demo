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

Open Claude Code in this folder, paste the crash output, and ask for options before any change is made. For example:

```
The /upload endpoint crashes with "JavaScript heap out of memory" when I
upload transactions.csv (output below). Don't change anything yet. Ask me
which fix I want, with your recommendation.

<paste the crash output here>
```

Claude Code should come back with a multiple-choice question, with its pick marked "(Recommended)". The exact wording and options depend on the session, so it may take a run or two to get a clean screenshot.

## What each fix actually does

- **Raise the heap limit** (`--max-old-space-size`). The crash goes away, until a bigger file arrives. With a 2 GB heap this file uploads fine.
- **Stream the file.** Parse line by line as the request body arrives, so memory stays flat whatever the file size. This is the real fix.
- **Move parsing into a worker thread.** Keeps the event loop free, but a worker has its own V8 heap, so building every row object there can run out of memory just the same.

## Clean up

`transactions.csv` is about 150 MB. Delete it when you're done.
