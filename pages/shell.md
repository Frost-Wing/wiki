---
title: Frosted Shell
group: Userland
icon: terminal
desc: the ring-0 shell
---

A custom implementation of `sh`, running in kernel mode (ring-0). **You are responsible for your actions.**

It serves as an playground for testing and debugging and also as an fallback if userland applications fail.

```sh
# Mounting without rootdisk= bootdisk=
mount disk1p1 /
mount proc /proc
mount dev /dev
mount sys /sys
mount disk0p1 /boot
```

> [!err] ring-0
> There is no safety net here. A bad command can take the whole kernel down.
> 