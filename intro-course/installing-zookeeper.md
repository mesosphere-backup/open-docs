---
layout: doc
title: Exercise 2 – Installing ZooKeeper
---

Apache Mesos uses ZooKeeper to operate.  Apache Mesos also works with ``etcd`` but it is currently (as of
Feb 2015) not recommended for production installations.  ZooKeeper acts as the master election service in the Mesosphere architecture and
stores state for the Mesos nodes.

In this exercise:

1. Install the necessary ZooKeeper RPMs.
2. Initialize the ``zookeeper-server`` to use ID 1.
3. Start Zookeeper.
4. Test that Zookeeper works.
5. Shutdown and restart the ``zookeper-server`` down and validate that it works.


Video Lecture
-------------

{% mesos_video Mesos-Intro-Lecture-2 %}


Quick Reference
---------------

You can start Zookeeper after completing exercise 1.

Install Zookeeper and the Zookeeper server package by pointing to the RPM repository for ZooKeeper:

{{ mesos.code("ex2/zookeeper_rpms.sh-session") }}

Initialize and start Zookeeper:

{{ mesos.code("ex2/zookeeper_setup_start.sh-session") }}

Use the interactive shell to test your installation:

{{ mesos.code("ex2/zookeeper_test.sh-session") }}

Validate that you can stop and restart ZooKeeper:

{{ mesos.code("ex2/zookeeper_restart.sh-session") }}

Further Study
-------------

* [Read about ZooKeeper](http://zookeeper.apache.org/doc/r3.3.2/zookeeperAdmin.html) and learn how to work with it by using the shell.
* Try taking ZooKeeper down and then attempt to use the shell again.  This will show you some of the common error messages you get.
* Find ZooKeeper in your process list, and find out where it is installed on the system.


