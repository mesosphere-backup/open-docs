---
layout: doc
title: Exercise 16 – Recreating the Cluster Using Ansible
---

You have a miniature Mesosphere cluster running on your computer, but what would happen if you had to destroy it and start over?  Luckily we have the `Ansible <http://www.ansible.com/home>`_ tool where you can run one command to recreate your entire little cluster.

This exercise shows you how to create an Ansible playbook that can recreate the entire cluster
that you manually created for the last 15 exercises.  You could have started with this, but then you wouldn't
have known all the core concepts of Meso, Marathon, Chronos, and would be lost when you run into
trouble.

In this exercise:

1. Create a simple ``playbook.yml`` file to get the master node working.
2. Change the ``Vagrantfile`` to run Ansible and your playbook when provisioning.
3. Augment the ``playbook.yml`` and ``Vagrantfile`` to provision nodes 2-4.
4. Destroy everything and confirm you can rebuild everything with one command.

Video Lecture
-------------

{{ mesos.video("Mesos-Intro-Course-16") }}


Quick Reference
---------------

To begin this exercise you will run ``vagrant destroy`` to destroy the cluster you just built.  If you'd like to keep it around then feel free to make a  new directory for this exercise or backup the directory first.  Once you're ready do::

    vagrant destroy -f

Now we can recreate everything with Ansible to automate the whole operation.  Ansible uses a YAML file to control how to build any Vagrant nodes, and Vagrant knows about Ansible configurations.  To get started, create a simple ``playbook.yml`` file with this:

{{ mesos.code("ex16/playbook.yml", section="master") }}

This playbook uses a simple script to install Mesos DNS called ``installdns.sh``:

{{ mesos.code("ex16/installdns.sh") }}

And make sure you create the following ``config.json`` file from Exercise 7:

{{ mesos.code("ex7/config.json") }}

You next need this ``hosts.j2`` file so Ansible can update your ``/etc/hosts`` file:

{{ mesos.code("ex15/hosts.j2") }}

And this ``resolv.conf.j2`` file to update ``/etc/resolv.conf``:

{{ mesos.code("ex16/resolv.conf.j2") }}

This will solve the problem of having proper host:ip mappings in our little cluster.
Modify the ``Vagrantfile`` to be like this now:

{{ mesos.code("ex16/Vagrant.rb") }}

Notice this is now stripped of the default comments and I've done the following to it:

* Created an ``ANSIBLE_GROUPS`` variable to store our groupings for hosts.
* Added a ``node.vm.provision`` block to each node.
* Added the ``ansible.playbook`` and ``ansible.groups`` settings inside that.
* Removed the use of the ``mesos-master`` box from our previous exercises for ``node1``.

Enter this command to get ``node1`` working:

{{ mesos.code("ex16/setup.sh-session", section="node1") }}

That should run every single thing necessary to get a master node up.  You should do the
usual tests of Marathon, Chronos, and Mesos as you've learned in Module 1.

Add a part of the ``playbook.yml`` that configures the slave nodes
too:

{{ mesos.code("ex16/playbook.yml", section="slaves") }}

Run this command to bring your nodes up:

{{ mesos.code("ex16/setup.sh-session", section="slaves") }}

And the remaining nodes will come up and be installed, but this time Vagrant will run Ansible to automatically configure everything.  This takes a while, but you can look at the Marathon GUI to watch everything come online while it's running.


Further Study
-------------

* Destroy the whole cluster and recreate it with ``vagrant up``.
* Review the Ansible documentation and learn more about it.



