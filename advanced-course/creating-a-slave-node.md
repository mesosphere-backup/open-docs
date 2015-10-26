---
layout: doc
title: Exercise 9 – Creating A Slave Node

redirect_from:
- /intro-course/ex9.html
---

Using a single node is boring.  You'll now create a second node to learn how the Mesosphere stack
works with multiple machines, which is the entire point.  Most of this exercise is a repeat of
the first 8 exercises but compressed and simplified for the requirements of a slave node.

In this exercise you will:

1. Make sure all the ``node1`` services will restart on reboot with ``chkconfig``.
2. Halt the Vagrant for ``node1`` and make a copy of it.
3. Use that copy to create a new master node with a new two node ``Vagrantfile``.


Video Lecture
-------------

{% mesos_video Mesos-Intro-Lecture-9 %}


Quick Reference
---------------

You need to do some cleanup before you can shut down and pacakge ``node1``.  Make sure that all of the services are
properly set to start on boot with ``chkconfig``:

```
[node1]$ sudo chkconfig zookeeper-server on
[node1]$ sudo chkconfig mesos-master on
[node1]$ sudo chkconfig mesos-slave on
[node1]$ sudo chkconfig marathon on
 # if you are running chronos with marathon then do not do this
[node1]$ sudo chkconfig chronos on
```

Once you do that we need to make a Vagrant box out of it so we can copy it over to our new setup:

```
$ vagrant halt
$ vagrant package default
$ vagrant destroy default
$ vagrant box add mesos-master package.box
```


Next you need to add a two node configuration to your ``Vagrantfile``.  The line that has your network config now needs this:

```
# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "bento/centos-7.1"
  config.vm.define "node1" do |node1|
      node1.vm.network "private_network", ip: "192.168.33.10"
      node1.vm.hostname = "node1"
      node1.vm.box = "mesos-master"
  end

  config.vm.define "node2" do |node2|
      node2.vm.network "private_network", ip: "192.168.33.11"
      node2.vm.hostname = "node2"
  end
end
```


Once you have that in your ``Vagrantfile`` you can then do ``vagrant up`` and it will recreate your original Vagrant master from the ``package.box`` file you created naming it ``node1``, and start a new VM named ``node2`` with no configuration in it.

Further Study
-------------

* Read more about Vagrant multi-machine configurations at http://docs.vagrantup.com/v2/multi-machine/


