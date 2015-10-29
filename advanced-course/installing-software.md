---
layout: doc
title: Exercise 1 – Installing Software

redirect_from:
- /intro-course/ex1.html
- /getting-started/developer/vm-install/
- /getting-started/developer/
---

To begin, you must install the prequisite software into a virtual machine on your computer.  We use CentOS 7 for this course and it is recommended for this course.

In this exercise:

1. Install [Vagrant](https://www.vagrantup.com/) and [VirtualBox](https://www.virtualbox.org/). *MAKE SURE YOU HAVE THE LATEST ONE*. Older versions of Vagrant do not work.
2. Install a simple Centos-7.1 Vagrant VM.
3. Configure your ``/etc/hosts`` file to have the correct hosts.
4. Add the Mesosphere RPM repository.
5. Install the ``mesos`` and ``marathon`` RPMs.


Video Lecture
-------------


{% mesos_video Mesos-Intro-Lecture-1 %}


Quick Reference
---------------

Install [Vagrant](https://www.vagrantup.com/) and [VirtualBox](https://www.virtualbox.org/). *MAKE SURE YOU HAVE THE LATEST ONE*. Older versions of Vagrant do not work.
Create a virtual machine with Vagrant running the CentOS 7.1 Linux distro. This will download the image you need so it takes a little while:

```
$ mkdir vm-install
$ cd vm-install
$ vagrant init bento/centos-7.1
```

Edit the ``Vagrantfile`` to uncomment the line with ``config.vm.network "private_network", ip: "192.168.33.10"`` and add the line ``config.vm.hostname = "node1"`` right after that:

```
# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "bento/centos-7.1"

  config.vm.network "private_network", ip: "192.168.33.10"
  config.vm.hostname = "node1"
end
```

Start the VM and ssh into it:

```
$ vagrant up
$ vagrant ssh
```

Modify the ``/etc/hosts`` file to make the ``node1`` name map to the IP address in the ``Vagrantfile``:

```
[node1]$ sudo vi /etc/hosts
[node1]$ cat /etc/hosts
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
192.168.33.10 node1
```

Install the Mesosphere software packages:

```
[node1]$ sudo rpm -Uvh http://repos.mesosphere.com/el/7/noarch/RPMS/mesosphere-el-repo-7-1.noarch.rpm
[node1]$ sudo yum -y install mesos marathon
```

**Tip:** You can use ``cat`` to display the updated file.  The change is to remove ``node1`` from the ``127.0.0.1`` line and create a new line with ``192.168.33.10 node1`` at the end.

Further Study
-------------

* Explore your new Vagrant CentOS VM and become familiar.
* Read up on Vagrant and look at the contents of the Vagrantfile that was downloaded into ``vm-install``.
* Use ``vagrant halt``, ``vagrant destroy`` and ``vagrant up`` to rebuild the VM again.
