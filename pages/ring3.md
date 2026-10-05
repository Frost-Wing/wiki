---
title: Entering Ring-3
group: Userland
icon: nf-fa-ring
desc: Running the executables
---

## Initial Steps

Our priority is to enter `userland` as soon as possible. FrostWing is tested with both static and dynamic builds of [Toybox](https://github.com/landley/toybox)

```sh
# entering userland, run the following to enter the userland
exec /bin/toybox sh
$ . /etc/profile
```

Now all of normal linux utils can be used without an problem.