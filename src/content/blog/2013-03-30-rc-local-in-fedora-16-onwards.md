---
title: 'rc.local in Fedora 16 onwards'
excerpt: 'Fedora 16 dropped rc.local by default after moving to systemd — here''s how to bring it back so you can still run commands at boot.'
publishDate: '2013-03-30'
tags:
  - computer
  - rc.local
  - running shell scripts during boot
  - terminal code
---

Fedora 16 brought with itself many new features and changes from its previous versions. Fedora 16 takes advantage of several new technologies to improve the speed, security and efficiency of the boot process. The prominent changes in the boot system are:

1. introduction of **Grub2**
2. porting of **SysVinit** scripts to **systemd**
3. **rc.local** is no longer present by default

Though `etc/rc.d/rc.local` is no longer available by default, but it still works fine once you set it up correctly. rc.local is a file that contains commands user would like to run while booting fedora. Here in this post i will show you how to set it up in Fedora 16 and higher version of Fedora.

### Setup Instructions

**Step 1:** Open the Terminal

**Step 2:** Type the following command to create the file, type the user password when asked for (for this you must have your username added to the sudoers list, else you may follow this tutorial to add to [sudoers](https://subhoworld.wordpress.com/2013/03/29/adding-users-to-sudoers-list/) list)

```bash
$sudo vi /etc/rc.d/rc.local
```

OR

you may also do this without using **sudo**, in that case type this

```bash
$su -c "vi /etc/rc.d/rc.local"
```

Type the root password in when asked for.

**Step 3:** Press "I" to turn on INSERT mode. Add the following to the top

```bash
#!/bin/sh
```

**Step 4:** Now you may add your personal commands if any. and press Esc, to exit INSERT mode. Then type "**:wq**" to save and close the file

**Step 5:** Now to make the file executable type the following in your bash terminal

```bash
$chmod 755 /etc/rc.d/rc.local
```

Once you do these steps, systemd will see the file exists, is executable and is a shell script, and will run it. No further action needed.

I hope the newer versions of Fedora keep this functionality of rc.local active as it's sometimes handy to run things in a simple script rather than create a new unit file for it.
