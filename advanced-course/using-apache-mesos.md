---
layout: doc
title: Exercise 3 – Using Apache Mesos

redirect_from:
- /intro-course/ex3.html
---

Apache Mesos is the foundation of the Mesosphere technology stack and powers all of the communications and
system management.  Mesos uses a simple architecture to give you
intelligent task distribution across a cluster of machines without worrying about where they are
scheduled.  In this module Mesos is used to run and manage services on a four
node cluster.  To get started you must set up the ``mesos-master`` on ``node1``.

**Prerequisite** (see Exercise 1):
Edit your /etc/hosts file to set node1 to the IP address 192.168.33.10.

In this exercise:

1. Start the ``mesos-master`` and ``mesos-slave`` processes.
2. Test that the ``mesos-master`` and ``mesos-slave`` processes are working as expected.
3. Execute a sample command from the command line.
4. Observe the command's progress from both the command line and a web GUI.


Video Lecture
-------------

{% mesos_video Mesos-Intro-Lecture-3 %}


Quick Reference
---------------

Start the mesos-master and mesos-slave processes:

```
[node1]$ sudo service mesos-master start
[node1]$ sudo service mesos-slave start
[node1]$ sudo netstat -nlp | grep mesos
```

Access the Mesos user interface with your browser at ``http://192.168.33.10:5050`` and confirm that the IP address shown in the user interface is ``192.168.33.10``.  If not, start over by using ``vagrant destroy``.


Test out mesos by using the ``mesos-execute`` command:

```
[node1]$ export MASTER=$(mesos-resolve `cat /etc/mesos/zk` 2>/dev/null)
[node1]$ mesos help
[node1]$ mesos-execute --master=$MASTER --name="cluster-test" --command="sleep 40"
```

With the ``mesos-execute`` command running,  enter ``ctrl-z`` to suspend the command. You can see how it appears in the web UI and command line:

```
# hit ctrl-z
[node1]$ bg # this sends the process into the background
[node1]$ mesos ps --master=$MASTER
```

Further Study
-------------

* Try running a few other commands using ``mesos-execute``.
* Find out what the commands listed in ``mesos help`` do and try to use a few of them.

