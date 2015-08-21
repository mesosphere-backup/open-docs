---
layout: doc
title: Exercise 15 – Starting Four Nodes
---

This exercise adds two more slave nodes to our small
cluster.  These nodes are designed to mostly run the Docker/Go ``outyet``
web application that we've been using.  The process is made easier by a convenient
shell script that you can turn into a Chef, Puppet recipe.

In this exercise:

1. Edit the ``Vagrantfile`` to include the new nodes #3 and #4.
2. Create a file named ``installnode.sh`` on the host machine to use in other nodes.
3. Alter the ``/etc/hosts`` files as usual.
4. Use the ``installnode.sh`` script to automatically install everything and get ``outyet`` running.
5. Use Marathon to scale up to 4 Outyet instances.

Be forewarned that your computer processor might only be able to
do three nodes.


Video Lecture
-------------

{{ mesos.video("Mesos-Intro-Lecture-15") }}


Quick Reference
---------------

Add a new section to the ``Vagrantfile`` for ``node3`` and ``node4``:

{{ mesos.code("ex15/Vagrantfile.rb") }}

Run ``vagrant up`` to ensure that ``node3`` and ``node4`` come up.

You next need to fix all the ``/etc/hosts`` files on all machines.  Easest way to do that is create a
file in the ``vm-install`` directory named ``hosts.j2`` (you'll see why later) with these contents:

{{ mesos.code("ex15/hosts.j2") }}

With that you can do this on each host using this little shell script, or type this all on one line:

{{ mesos.code("ex15/update_hosts.sh") }}

And that will fix all of them to have the correct IP addresses and host names.

To install all the required software, I created a shell script named ``installnode.sh`` to do create new nodes:

{{ mesos.code("ex15/installnode.sh") }}

Save this to ``installnode.sh`` in your host directory and then on ``node3`` you can run this command to get it to build this node:

{{ mesos.code("ex15/installnode.sh-session", section="runscript") }}

Run the Docker command to test the node:

{{ mesos.code("ex15/installnode.sh-session", section="testdocker") }}

Repeat these steps for ``node4`` and then you can go into Marathon and again expand it out to 4 instances of this web application running.

Further Study
-------------

* Create a periodic task with Chronos and see how it runs on the cluster.
* Take nodes down and see how Mesos and Marathon deal with it.


