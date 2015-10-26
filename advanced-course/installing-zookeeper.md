---
layout: doc
title: Exercise 2 – Installing ZooKeeper

redirect_from:
- /intro-course/ex2.html
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

```
[node1]$ sudo rpm -Uvh http://archive.cloudera.com/cdh4/one-click-install/redhat/6/x86_64/cloudera-cdh-4-0.x86_64.rpm
[node1]$ sudo yum -y install zookeeper zookeeper-server
```

Initialize and start Zookeeper:

```
[node1]$ sudo -u zookeeper zookeeper-server-initialize --myid=1
[node1]$ sudo service zookeeper-server start
```

Use the interactive shell to test your installation:

```
[node1]$ /usr/lib/zookeeper/bin/zkCli.sh
# sometimes at this point you get an error that java is missing.  This means yum did NOT install java for...reasons.  Start over.
help
create /test 1
get /test 
set /test 2
get /test
delete /test
quit
```

Validate that you can stop and restart ZooKeeper:

```
[node1]$ sudo service zookeeper-server stop
[node1]$ sudo service zookeeper-server start
```

Further Study
-------------

* [Read about ZooKeeper](http://zookeeper.apache.org/doc/r3.3.2/zookeeperAdmin.html) and learn how to work with it by using the shell.
* Try taking ZooKeeper down and then attempt to use the shell again.  This will show you some of the common error messages you get.
* Find ZooKeeper in your process list, and find out where it is installed on the system.


