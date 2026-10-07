---
title: Compiling Kernel and ISO
group: Start
icon: terminal
desc: Complete guide to build the OS.
---

## Building FrostWing

### Prerequisites

**Debian-based** (Ubuntu, Pop!_OS, Kali, …)

```bash
sudo apt install -y make bison flex texinfo nasm mtools wget tar binutils \
  build-essential doxygen git jq curl qemu-system-x86 xorriso
```

**Arch-based** (Arch, Manjaro, …)

```bash
sudo pacman -S make bison flex texinfo nasm mtools wget tar binutils \
  base-devel doxygen git jq curl qemu qemu-system-x86 xorriso
```


---

### 1. Build the Cross Compiler

Clone the [fwtoolchain](https://github.com/Frost-Wing/fwtoolchain) repository, then run the build script:

```sh
git clone https://github.com/Frost-Wing/fwtoolchain.git
cd fwtoolchain
./build.sh
```

After installation, the standard GNU tools are available under these custom names:

| GNU tool  | FrostWing name |
|-----------|----------------|
| `gcc`     | `fwgcc`        |
| `g++`     | `fwg++`        |
| `ld`      | `fwld`         |
| `as`      | `fwas`         |
| `ar`      | `fwar`         |
| `objcopy` | `fwobjcopy`    |
| `objdump` | `fwobjdump`    |
| `nm`      | `fwnm`         |

---

### 2. Build FrostWing

**1. Clone the repository**

```bash
git clone https://github.com/Frost-Wing/osdev.git
cd osdev
```

**2. Install the bootloader**

Get [Limine](https://github.com/limine-bootloader/limine) (the last version compatible with the kernel), then compile it:

```bash
git clone https://github.com/limine-bootloader/limine.git --branch=v6.x-branch-binary --depth=1
make -C limine
```

**3. Build for your target architecture**

```bash
make -C source
make
```

**4. *(Recommended, tested)* Use your own cross compiler**

```bash
make -C source CC="xx" LD="xx"
make
```

> [!NOTE]
> A suitable cross-compiler was built for **x86_64**, and the OS is meant to work on it. Other cross compilers are untested, so use them at your own risk.

---

### Quick Build

Clean, compile, build the ISO, and test-run in QEMU, all in one go:

```bash
make everything
```

---

### Editor Setup: Code - OSS + clangd

> [!TIP]
> This repo includes workspace settings and a Makefile helper for clangd IntelliSense.

1. Install the `clangd` language server and the extension [`llvm-vs-code-extensions.vscode-clangd`](https://marketplace.visualstudio.com/items?itemName=llvm-vs-code-extensions.vscode-clangd).
2. From the repo root, run:
```bash
   make clangd
```
   This generates `source/compile_commands.json` using the same include paths and flags as `source/Makefile`.
3. Open the repo in Code - OSS. clangd will pick up `.vscode/settings.json` and index the code automatically.

---

> [!NOTE]
> Main rootdisk is NOT built and OS will not run in QEMU VM,
> but will run fine in an real machine without rootdisk.
>
> Refer Next Article for building `disk.img` and installing rootfs to a disk.

### Now you can scream *"I use FrostWing btw"*

![I use FrostWing btw](https://raw.githubusercontent.com/Frost-Wing/wiki/f1d49dd809aabd8d5ae3b35a71ee5fb2a04c7a0f/pics/i-use-fw-btw.png)