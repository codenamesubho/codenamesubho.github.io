---
title: 'Disabling discrete AMD Graphics card in linux'
excerpt: 'How to disable a discrete AMD graphics card in a switchable graphics laptop setup on Linux using vgaswitcheroo, to cut heat, fan noise, and power draw.'
publishDate: '2013-04-25'
updatedDate: '2014-08-04'
tags:
  - ATI graphics awitch off
  - Fedora
---

This article is posted to show how to disable the discrete AMD graphics card in a switchable graphics setup in laptops. The integrated graphics card can be an AMD or an Intel. Disabling the discrete graphics card will save your laptop from overheating and will save considerable amount of power.

This article is intended for those who are ready to have only the integrated card enabled. If you can configure both cards correctly, then you probably don't need this. If you would like to have both cards running and want to switch between them, you need to look elsewhere.

### The Problem:

I've a Dell Inspiron 15R model with HD 7670M discrete graphics and Ivy Bridge Intel 4000 integrated graphics card. All the distributions I've tried so far ran too hot with a lot of fan noise. In some cases, the laptop would turn off all of a sudden as it reached the maximum temperature it can handle!! The integrated card is capable enough to play 1080p video and desktops effects and hence I prefer the dedicated card turned off all the time.

### The Solution:

#### Check if you have two graphics cards

Open 'terminal' and type the following command.

```
$lspci | grep VGA
```

If you see more than one graphics card, then you have a switchable graphics setup.

#### Check if both the cards are powered on

To check this, we need be able to view the file `/sys/kernel/debug/vgaswitcheroo/switch`. Type the following in terminal.

```
$cat /sys/kernel/debug/vgaswitcheroo/switch
```

If you get *'Permission Denied'* error, then type,

```
$sudo chown <your user name> /sys/kernel/debug/
```

and then, type

```
$sudo chown <your user name>  /sys/kernel/debug/vgaswitcheroo/switch
```

Now you should be able to view the file using the *'cat'* command given above.

If you get *'No such file or directory'* error when trying the command *'cat /sys/kernel/debug/vgaswitcheroo/switch'*, then type

```
$sudo mount -t debugfs none /sys/kernel/debug
```

and follow the above *'cat'* command to view the '*switch'* file.

The result of the *'cat /sys/kernel/debug/vgaswitcheroo/switch'* will have *'Pwr'* in both lines (for integrated card which is denoted using the string *"IGD"* and*"DIS"* for discrete card) indicating both cards are powered on.

#### Disable the discrete graphics card

To disable the discrete card, type

```
$echo OFF >/sys/kernel/debug/vgaswitcheroo/switch
```

and if you check the *'switch'* file using the *'cat'* command given before, you can see that the *'Pwr'* has been changed to *'off'*.

You can use a temperature or power monitoring tool to compare the power usages before and after disabling the discrete graphics card.

To have the discrete card disabled at system start-up so that you won't have to do all these steps at every time you boot your system, you may use [rc.local](https://subhoworld.wordpress.com/2013/03/30/rc-local-in-fedora-16-onwards/ "rc.local") file.

### Notes:

- I've tested the above method only using the ATI/Intel available in my laptop
- Distributions tested : Ubuntu 12.10 and Fedora 18
