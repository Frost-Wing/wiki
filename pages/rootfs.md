---
title: RootFS (Installing and Configuring)
group: Start
icon: rocket
desc: Real machine & VMs
---

> [!NOTE]
> FrostWing will never have an dedicated installer, installation will be difficult and will test your skills. The installation are prone to many places of failure, follow the wiki carefully to avoid those.

## Preparing `disk.img` for QEMU

### Step 1

Git clone the rootfs repository.

```bash
git clone https://github.com/Frost-Wing/rootfs.git
cd rootfs
```

### Step 2

Install pre-requisite python packages and linux commands.

| Package                | Provides                                         | Used for                                      |
|------------------------|--------------------------------------------------|-----------------------------------------------|
| `python` (3.10+)       | `python3`                                        | running the script                            |
| `sudo`                 | `sudo`                                           | all privileged operations                     |
| `arch-install-scripts` | `pacstrap`                                       | building `arch-root`                          |
| `rsync`                | `rsync`                                          | the merge step (after the fix)                |
| `coreutils`            | `cp`, `rm`, `chown`, `mkdir`, `truncate`, `sync` | copying, cleanup, sparse image creation       |
| `util-linux`           | `losetup`, `mount`, `umount`, `lsblk`            | loop devices, mounting, partition checks      |
| `parted`               | `parted`                                         | GPT label and partition creation              |
| `e2fsprogs`            | `mkfs.ext2`                                      | formatting the image and target partition     |

### Step 3

Run the following command to obtain `disk.img` which is prepared cleanly and with ext2 filesystem and ready to be used in VMs.
```
./frost.py build
```

## Preparing an actual disk for an real machine

Flash [FrostWing.iso](https://github.com/Frost-Wing/osdev/releases/latest/download/FrostWing.iso) from [osdev](https://github.com/Frost-Wing/osdev) build to obtain an bootable disk where first 3* partitions would be generated for meta and bootdisk.

> [!NOTE]
> Using github-actions release means the limine.cfg will be fixed and you need to update your `bootdisk=` and `rootdisk=` everytime you boot
> 
> Therefore git clone the OS repo and goto `/source/boot/limine.cfg` and update the `bootdisk=` and `rootdisk=`
> with your specific OS setup.

### Flash bootloader and kernel in bootdisk

```bash
# Assuming you are in the root directory of /osdev/ or the directory where
# you have downloaded the FrostWing.iso
sudo dd if=./FrostWing.iso of=/dev/sdX bs=4M status=progress conv=fsync
```

### Create empty parition

After flashing, the ISO only occupies the first few MB of the drive. Create a new partition in the remaining space for the root filesystem.

> [!WARNING]
> Replace `/dev/sdX` with your actual drive. Running these against the wrong disk will destroy its data. Verify with `lsblk` first.

```bash
# Unmount anything that was auto-mounted from the drive
sudo umount /dev/sdX?* 2>/dev/null

# Check the partition table type (should be gpt)
lsblk -o NAME,SIZE,RM,PTTYPE /dev/sdX

# Move the backup GPT header to the end of the disk (the ISO is much smaller than the drive)
sudo sgdisk -e /dev/sdX

# Create partition 4 using all remaining space (8300 = Linux filesystem)
sudo sgdisk -n 4:0:0 -t 4:8300 -c 4:rootfs /dev/sdX

# Re-read the partition table and verify
sudo partprobe /dev/sdX
lsblk /dev/sdX
```

You should now see a new `/dev/sdX4` covering the rest of the drive. Do **not** format it, `frost.py` does that for you.

> [!NOTE]
> `sgdisk` is provided by `gdisk` (Debian/Ubuntu) or `gptfdisk` (Arch/Manjaro).

### Note down the bootdisk

Note the identifiers of your partitions, you will need them for the `bootdisk=` and `rootdisk=` values in `limine.cfg`.

```bash
lsblk -o NAME,SIZE,FSTYPE,LABEL,PARTUUID,UUID /dev/sdX
```

Follow Step 1 and 2 as directed above for QEMU VM and run the following command:

```bash
./frost.py install /dev/sdX1
```

Wait for it to complete and you will own an HDD/SSD/NVME which on plugging into any desktop/PC will run FrostWing OS with rootfs.