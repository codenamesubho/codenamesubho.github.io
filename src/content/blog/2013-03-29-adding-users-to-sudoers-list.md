---
title: 'Adding Users to Sudoers List'
excerpt: 'A quick walkthrough of adding a user to the sudoers list with visudo, plus a note on the security tradeoffs of granting full root privilege versus scoping it to specific commands.'
publishDate: '2013-03-29'
tags:
  - sudo
  - sudoers
  - userprivilege
---

"How to add an user to the Sudoers list?", a quite common question asked by many. So here in this post i am writing the most convenient method to do it. 🙂

But before i start with the process to add an user to the sudoer list, let me tell you why we do this.

On adding a new user to the sudoers list **that** user will be able to run commands and open files with **root** user privilege.

### Process to add an user to the sudoers list:

1. Open terminal.

2. Type the following command

```
$su -c visudo
```

Enter the root password when asked.

3. You can move the cursor using up/down arrow key. Move down to the line containing

```
root ALL=(ALL) ALL
```

4. Press "i" to activate insert mode then add the following code just after the above line

```
<new username>  ALL=(ALL) ALL
```

So now it looks something like this

```
## Allow root to run any commands anywhere
root ALL=(ALL) ALL
<username> ALL=(ALL) ALL
```

5. You might need to remove the # in front of the line `%wheel ALL=(ALL) ALL`. Mine was already done so I didn't have to remove it. So now it looks like

```
## Allows people in group wheel to run all commands
%wheel ALL=(ALL) ALL
```

6. Press **Esc** to come out of insert mode, then type ":wq" in the command line and press enter to save and quit from vi. And that's it you have done it. 😀

Here is a slideshow showing the sudoers file:

![Sudoers file screenshot 1](https://subhoworld.wordpress.com/wp-content/uploads/2013/03/screenshot-from-2013-03-29-003441.png)

![Sudoers file screenshot 2](https://subhoworld.wordpress.com/wp-content/uploads/2013/03/screenshot-from-2013-03-29-003720.png)

---

## Security Considerations

But here in step number 4 you assign a **root privilege** to the user which again compromises your security. Once added to the sudoers list the user can change the password for other users, hence it is quite not advisable if your machine has multiple users logging in as your security might get compromised.

Instead of giving **root privilege** for all the commands you can specify the commands with root privilege that the user might use.

For example:

```
<new username>  ALL=/usr/bin/yum
```

If your machine is common to many users I would suggest you to allow only particular commands to be executed with root privilege else if you are the sole user then like me you may allow all commands to be executed by the user with root privilege.
