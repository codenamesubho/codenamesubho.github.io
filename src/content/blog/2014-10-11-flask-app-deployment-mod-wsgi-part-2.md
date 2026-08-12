---
title: 'Setting up a web-server for flask-app deployment in mod_wsgi :: Part-2 ::'
excerpt: 'Deploying a Flask app on Apache with mod_wsgi: installing packages, setting up a virtualenv, writing the .wsgi file, configuring Apache, and locking down file permissions with a dedicated group.'
publishDate: '2014-10-11'
updatedDate: '2015-02-26'
tags:
  - AWS
  - Flask
  - Python
  - mod_wsgi
---

Before we start I would assume we are ready with our cloud instance and are able to connect to it via ssh as shown in [Part-1](https://subhoworld.wordpress.com/2014/10/07/setting-up-a-web-server-for-flask-app-deployment-in-mod_wsgi-part-1/) of this post. I expect that you have your flask application ready already. Lets start with setting up the web-server without anymore delay. We can deploy our application in many ways, but we will be focussing on mod_wsgi in this post. First we need to install some of the basic packages needed for setting up a web-server.

```
sudo apt-get install apache2 libapache2-mod-wsgi #For Debian/Ubuntu:

sudo yum install mod_wsgi                        #For Rpm based OS
```

You can test if things are working and server is up, just find out your public IP from amazon ec2 console, and type it in your browser. This should show the default pages. Next we need to get our flask app into the instance. For this i used github as remote repository. You need to install Git and then Git clone your repo into the user home. Now setup virtualenv and install the dependencies(installing dependencies into virtual environment is a good practice) :

```
sudo apt-get install python-pip
or                                  #depending on the OS
sudo yum install python-pip
sudo pip install virtualenv
```

Now that you have your virtualenv installed we will now create our virtual environment

```
virtualenv
eg: virtualenv env
source /bin/activate #to activate the virtualenv
```

you can singly install dependencies as

```
pip install <package-name>
```

Or install from a requirements.txt file as

```
pip install -r requirements.txt
```

Now copy your whole project along with virtual environment to '/var/www/' folder.

```
sudo cp /current/path/app-root /var/www/ -r
```

## Adding your .wsgi file

Now that you are ready lets add a new file to our app root called the named 'youappname.wsgi' Having the content

```
from yourapplication import app as application //structure this line such that you must be
                                               //able to import app from your flask-app as
                                               //application
```

To run our app we need to specify the environment path.

### Method 1

Adding the following two line to the top of your .wsgi file.

```
activate_this = '/var/www/project-root/your_virtualenv/bin/activate_this.py'
execfile(activate_this, dict(__file__=activate_this))
```

**Method 2:** This method will be shown in the next topic

## Writing config file for apache

This took me some while to figure out how and what to write in this file. You need to create a configuration file for apache.

```
sudo vi /etc/apache2/sites-enabled/000-default.conf    // for Ubuntu
sudo vi /etc/httpd/conf.d/wsgi.conf  //for RHELorAmazon Linux
```

Now add the following line to the file. **Method 2 for adding virtual environment path is shown below.**

```
WSGISocketPrefix /var/run/wsgi        // to avoid permission denied error in RHEL or Amazon
                                      // Linux , not necessary in ubuntu

ServerName yourservername.com
WSGIDaemonProcess yourappname user=user1 group=group1 threads=5 python-path=/var/www/yourappname:/var/www/test_app/env/lib/python2.6/site-packages    //running as different user is
                                                          //good for security reason
WSGIScriptAlias / /var/www/yourappname/yourappname.wsgi

           WSGIProcessGroup yourappname
           WSGIApplicationGroup %{GLOBAL}
           Order deny,allow
           Allow from all
```

You can check the [link](https://github.com/Ghost-script/test) if you find things confusing. In mod_wsgi jinja2 won't show you errors in browser even if you put 'app.debug=True' instead you can make your app show debug output and print statements in terminal. For this you need to add

```
WSGIRestrictStdout Off
```

in the config files. You need to open these config files using vi editor.

```
sudo vi /etc/apache2/apache.conf    // for Ubuntu
sudo vi /etc/httpd/conf/httpd.conf  //for RHELorAmazon Linux
```

Now **ubuntu** users need to enable mod wsgi and restart server.

```
sudo a2enmod wsgi
sudo service apache2 restart
```

RHEL users just need to restart their server. To do so type

```
sudo service httpd restart //you may get a [FAIL] for stopping server, that's ok because you are running apache 1st time.
```

If things work fine well and good if not then you can have a look at the error logs.

```
sudo tail -f /var/log/apache2/* //for Ubuntu
sudo cat /etc/httpd/logs/error_log //for RHEL/Amazon Linux
```

Now if you look closely in the config file, we wrote user=user1 & group=group1. These needs to be created. For this: You can check the current owner and their permission using

```
ls -ld /var/www/site1/
drwxr-xr-x 2 root root 4096 Oct 10 11:21 site1/
```

Create the group first and then add the user to it.

```
sudo groupadd group1
```

Now adding the user to the new group

```
sudo useradd user1 -g group1
```

Also we need to add the apache user to this group but first we need to find it

```
finding the apache user,
ps aux | grep apache  //for Ubuntu it's generally www-data
ps aux | grep httpd   // for RHEL/Amazon Linux it's generally apache
then,
sudo usermod -a -G group1 <user>  //user as found from the above commands
```

You can now verify if the user you created is in the new group

```
groups user1
user1 :  group1 //output
```

Now we will change the ownership of the flask-app folder to **group1** so that it has full access only to that folder. This will let the app create new files or upload files into the server.

```
sudo chown -vR :group1 /var/www/site1/
changed ownership of `/var/www/site1/' from root:root to :group1
chown -> change ownership
-v    -> verbose it shows file names affected by the command
-R    -> recursively applies to all children
:group1 -> name of the new group1
```

```
sudo chmod -vR g+w /var/www/site1
mode of `/var/www/site1/' changed from 0755 (rwxr-xr-x) to 0775 (rwxrwxr-x)
chmod -> change mode bit
-v    -> verbose output
-R    -> Apply recursively
g+w   -> give write access to group
```

Now you can verify if group1 has been added

```
ls -ld /var/www/site1/
drwxrwxr-x 2 root group1 4096 Oct 10 11:21 /var/www/site1/
```

Restart your server and check . If you liked this blog give it a like and share it. Happy Coding. I have composed this article after reading a lot from the web and trying them out in practice. For further study you may like to go through these links below:

### Links

- http://blog.garethdwyer.co.za/2013/07/getting-simple-flask-app-running-on.html
- http://askubuntu.com/questions/365087/grant-a-user-permissions-on-www-data-owned-var-www
- https://www.digitalocean.com/community/tutorials/how-to-run-django-with-mod_wsgi-and-apache-with-a-virtualenv-python-environment-on-a-debian-vps
- http://flask.pocoo.org/docs/0.10/deploying/mod_wsgi/
- http://claudiosparpaglione.wordpress.com/2013/03/06/how-to-deploy-flask-applications-to-apache-webserver/
- http://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-xvi-debugging-testing-and-profiling
- http://stackoverflow.com/questions/2725858/can-apache-httpd-be-made-to-log-errors-to-console-instead-of-log-files-under-win
- http://stackoverflow.com/questions/4317156/how-do-i-figure-out-what-user-group-apache-is-running-as
- http://www.cyberciti.biz/faq/ubuntu-add-user-to-group-www-data/
- http://www.linux.com/learn/tutorials/760276-how-to-manage-file-and-folder-permissions-in-linux
- https://kb.iu.edu/d/abdb
- http://unix.stackexchange.com/questions/116070/granting-write-permissions-to-a-group-to-a-folder
- https://www.digitalocean.com/community/tutorials/how-to-deploy-a-flask-application-on-an-ubuntu-vps
