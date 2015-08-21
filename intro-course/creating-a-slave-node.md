---
layout: doc
title: Exercise 9 – Creating A Slave Node
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

{{ mesos.video("Mesos-Intro-Lecture-9") }}


Quick Reference
---------------

You need to do some cleanup before you can shut down and pacakge ``node1``.  Make sure that all of the services are
properly set to start on boot with ``chkconfig``:

{{ mesos.code("ex9/prepare_vagrant_package.sh-session", section="prep") }}

Once you do that we need to make a Vagrant box out of it so we can copy it over to our new setup:

{{ mesos.code("ex9/prepare_vagrant_package.sh-session", section="package") }}


Next you need to add a two node configuration to your ``Vagrantfile``.  The line that has your network config now needs this:

{{ mesos.code("ex9/Vagrantfile.rb") }}

Once you have that in your ``Vagrantfile`` you can then do Vagrant up and it will recreate your original Vagrant master from the ``package.box`` file you created naming it ``node1``, and start a new VM named ``node2`` with no configuration in it.

Further Study
-------------

* Read more about Vagrant multi-machine configurations at http://docs.vagrantup.com/v2/multi-machine/


