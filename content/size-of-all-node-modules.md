---
title: Size of all node\_modules
image:
imageMeta:
  attribution:
  attributionLink:
featured: true
authors:
  - nullvoxpopuli
date: Wed Jul 21 2021 15:45:43 GMT-0400 (Eastern Daylight Time)
tags:
  - shell
  - bash
  - file-system
  - quick-tip
  - javascript
---

# node\_modules

Ever been curious about how much space your `node_modules` directories are taking up across every project on your file system?

From the root of your project directory, run:
```bash
find . -name "node_modules" -type d -exec du -bc {} + \
  | grep total$ \
  | cut -f1 \
  | awk '{ total += $1 }; END { print total }' \
  | numfmt --to=iec
```

Explanation: https://unix.stackexchange.com/a/589060

This will search for every `node_modules` directory, find the size, and add all the sizes together before showing you a number.

For me (on an overworked computer), this was:

```bash
40G
>> took 6m37s
```
