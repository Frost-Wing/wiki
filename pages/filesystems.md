---
title: Filesystems & Storage
group: Kernel
icon: hdd
desc: VFS, Mounted Filesystems and Disks
---

## Filesystems

Everything goes through the VFS. Basic requirements:

| Mount | Filesystem | Source |
|---|---|---|
| `/` | EXT2 | Any* |
| `/proc` | PROCFS | proc |
| `/dev` | DEVFS | dev |
| `/sys` | SYSFS | sys |
| `/boot` | ISO9660 | Any* |

Officially Supported filesystems:

| Name | Versions |
|---|---|
| FAT | FAT16, FAT32 |
| ext | ext2 |
| iso | iso9660 |

## Storage

Following drives the OS will support and map cleanly;

| Disk Type | Naming Scheme | Example |
|---|---| --- |
| SATA | diskNpM | `disk1p1` |
| SATAPI | diskNpM | `disk0p1` |
| NVME | nvmeXnNpM | `nvme0n1p1` |
| USB (Mass Storage) | usbNpM | `usb0p1` |

## Supported Host Controller Interfaces

| Name | Use |
|---|---|
| `AHCI` | SATA & SATAPI |
| `XHCI` | USB 3.x |
| `EHCI` | USB 2.0 |