---
layout: doc
title: Exercise 10 – Installing Mesos
---

When the Vagrant VM is ready, you can install the necessary Mesos slave node software.  In this exercise:

1. SSH into the new node that you created.
2. Add the Mesosphere RPM repository.
3. Install only the ``mesos`` RPM package.
4. Add the new IP for ``node2`` to the ``/etc/hosts`` file.
5. Point the ``/etc/mesos/zk`` file at the ``node1`` master.
6. Start the slave service and make sure it starts on reboot.

Video Lecture
-------------

Video lecture going through the information and demo.

{% mesos_video Mesos-Intro-Lecture-10 %}


Quick Reference
---------------

When the Vagrant VM is ready, you can ``ssh`` into it with this command:

{{ mesos.code("ex10/install.sh-session", section="vagrantup") }}

Once ``node2`` starts Install Mesos by using:

{{ mesos.code("ex10/install.sh-session", section="yum") }}

Add the following lines to the ``/etc/hosts`` files::

    192.168.33.10 node1
    192.168.33.11 node2

Make sure to remove the "node2" mentioned on the first line for the 127.0.0.1 address.  If you do a ``ping node2`` then you should see 192.168.33.11 like this:

{{ mesos.code("ex10/node2_ping_test.sh-session") }}

If you see 127.0.0.1 then you have your first line wrong.  *Remove* node2 from the first line.

Also do this for ``node1``:

{{ mesos.code("ex10/node1_hosts.sh-session") }}

Edit the ``/etc/mesos/zk`` file to point to the master node::

    zk://192.168.33.10:2181/mesos

Start up Mesos as a slave with:

{{ mesos.code("ex10/install.sh-session", section="start") }}

Validate that it restarts:

{{ mesos.code("ex10/install.sh-session", section="chkconfig") }}

Further Study
-------------

* Validate that the ``/etc/hosts`` file is updated with all of the IP addresses.
* Add these IP addresses and node names to your *local* ``/etc/hosts`` file.
