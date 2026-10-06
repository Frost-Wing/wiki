---
title: Boot Log
group: Start
icon: terminal
desc: Few healthy boot messages
---
A healthy boot, copied from the console. The `log` highlighter understands the tags you already print.

```log serial output
[i] info kernel.c: Mounting root disk from cmdline: disk1p1
[!] warn vfs.c: disk1p1: not cleanly unmounted, run e2fsck
[+] done vfs.c: mount: mounted disk1p1 (EXT2) at '/'.
[+] done vfs.c: mount: mounted proc (PROCFS) at '/proc'.
[i] info kernel.c: Total modules: 1
[i] info kernel.c: Module[0]: /font.sfn, size: 2010067 bytes
 └─ [i] info fpu.c: Enabling floating-point arithmetic unit!
 └─ [+] done fpu.c: Enabled floating-point arithmetic unit!
[i] info kernel.c: Welcome to FrostWing Operating System!
```

> [!warn] not cleanly unmounted
> If `e2fsck` message is nagging you, the previous run did not shut down the disk properly.