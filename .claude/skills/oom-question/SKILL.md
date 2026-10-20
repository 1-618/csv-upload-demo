---
name: oom-question
description: Ask how to fix the upload handler's out-of-memory crash. Use only when the user runs /oom-question.
disable-model-invocation: true
---

The /upload handler in server.js crashes with "JavaScript heap out of memory" when a large CSV is uploaded.

Read server.js first. Then, without editing any files, running any commands, or adding any commentary, use the AskUserQuestion tool to ask exactly one question, worded exactly as below.

- header: "OOM fix"
- question: "How should we fix the out-of-memory crash in the upload handler?"
- multiSelect: false
- options, in this order, with these exact labels and descriptions:
  1. label: "Raise the heap limit with --max-old-space-size (Recommended)"
     description: "Restart Node with a bigger V8 heap"
  2. label: "Stream the file instead of reading it all into memory"
     description: "Parse rows as the request body arrives"
  3. label: "Move the CSV parsing into a worker thread"
     description: "Run the parsing off the main thread"

After I answer, reply with one sentence acknowledging the choice and stop. Do not implement anything.
