---
title: 'Setting up a web-server for flask-app deployment in mod_wsgi :: Part-1 ::'
excerpt: 'Launching an AWS EC2 instance and connecting to it via SSH as the first step toward deploying a Flask app with mod_wsgi.'
publishDate: '2014-10-07'
tags:
  - AWS
  - Flask
  - mod_wsgi
  - Python
---

Here i have discussed how to setup your cloud instance and connect to it. If you are already able to connect to your instance you can directly goto the Part-2 of this article. This week I had a tough time setting up my web-server for my flask-app. Firstly you need to get your server instance ready. I opted for [AWS EC2 Instance](http://aws.amazon.com/ec2/) for my app. you can look at these suggestions below for cloud server providers.

@ [Amazon EC2](http://aws.amazon.com/ec2/)

@ [Crowncloud](http://crowncloud.net)

@ [DigitalOcean](https://digitalocean.com)

## How to launch EC2 Instance?

If you selected AWS as your cloud server provider then you can continue reading else for others if your instance is ready you can directly jump to **Connecting to your Instance**. For AWS you need to create an account and login, then from aws console goto EC2 dashboard and then "Launch Instance". Select your Instance configuration and launch it.

**Step 1:** Select you Instance Image, which in simple works is the OS you want to use. I used *Ubuntu Server 14.04 LTS (HVM), SSD Volume Type 64-bit*

**Step 2:** Next choose the Instance Type depending on your needs.

**Step 3:** For now we are going to opt for the default settings.

**Step 4:** Attach a volume to your Instance. Specify the required size and type of Volume you need.

**Step 5:** You can Tag your instance for better identification of the instance.

**Step 6:** You can choose a security group if group already exists or create a new group. To create a new group select the "create new" option give a proper name to your security group, then add rules to it. For now we will add two rules:

```
Rule1 : set type as "ssh" and source "my ip" or "custom ip" (recommended),
selecting "anywhere" may be a security loophole.

Rule 2: set type as HTTP and source anywhere.
```

**Step 7:** Review and launch the instance. You will be asked to create a key pair or choose an existing one. To create new enter the key-pair name and download. **Note:** Do remember the downloaded key file location we will be needing it later. *Congrats Your Instance has been created!!!*

## How to connect to the instance?

If you are using windows in your local machine you can follow [this link](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html) to connect to your instance using putty. You can get putty and puttygen from [here](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html). Linux users have ssh installed by default so I will be using ssh from my local fedora machine to connect to my ubuntu instance. Before you connect change the file permission of the key-file

```bash
$chmod 400 /path/to/my_key_file.pem
```

Now to connect to the instance:

```bash
$ssh -i path/to/your/key-file.pem <user>@<public dns>

eg:
$ssh -i ~/.ssh/awskey.pem ec2-user@ec2-54-183-159-198.us-west-1.compute.amazonaws.com
```

Now, the key-file.pem here is the file that was downloaded to your machine while creating a new key-pair. The user here is ec2-user or root for Red-Hat Linux, ec2-user for Amazon Linux and ubuntu for Ubuntu. You can get your Public DNS from your instance page as shown below.

![Public DNS](https://subhoworld.wordpress.com/wp-content/uploads/2014/10/screenshot-from-2014-10-07-2135421.png)

If its the first time you are logging into the instance you will be asked if it can store the ECDSA fingerprint. Type in "yes" and it will be added to your list of known host. Next time you will be spared from these questions.

![SSH](https://subhoworld.wordpress.com/wp-content/uploads/2014/10/screenshot-from-2014-10-07-2141371.png)

In the next part we shall discuss how to deploy the application in server.

**Note:** For people with dynamic ip may have prolbem connecting to your instance if your ip gets changed (like mine). Solution is open EC2 dashoard -> Security Groups -> select the security group attached to your instance -> Click the "Inbound" tab below -> edit -> Change the source for ssh to my ip -> Save . Now try logging in from your terminal.
