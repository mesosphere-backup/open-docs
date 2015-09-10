---
layout: doc
title: Exercise 10 – Installing Mesos

redirect_from:
- /intro-course/ex10.html
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

```
$ vagrant up node2
$ vagrant ssh node2
```

Once ``node2`` starts Install Mesos by using:

```
$ sudo rpm -Uvh http://repos.mesosphere.com/el/7/noarch/RPMS/mesosphere-el-repo-7-1.noarch.rpm
$ sudo yum -y install mesos
```

Add the following lines to the ``/etc/hosts`` files::

    192.168.33.10 node1
    192.168.33.11 node2

Make sure to remove the "node2" mentioned on the first line for the 127.0.0.1 address.  If you do a ``ping node2`` then you should see 192.168.33.11 like this:

```
$ ping node2
PING node2 (192.168.33.11) 56(84) bytes of data.
64 bytes from node2 (192.168.33.11): icmp_seq=1 ttl=64 time=0.043 ms
64 bytes from node2 (192.168.33.11): icmp_seq=2 ttl=64 time=0.027 ms
64 bytes from node2 (192.168.33.11): icmp_seq=3 ttl=64 time=0.026 ms
^C
--- node2 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2001ms
rtt min/avg/max/mdev = 0.026/0.032/0.043/0.007 ms
$
```

If you see 127.0.0.1 then you have your first line wrong.  *Remove* node2 from the first line.

Also do this for ``node1``:

```
$ vagrant ssh node1
$ sudo vi /etc/hosts
$ ping node2
PING node2 (192.168.33.11) 56(84) bytes of data.
64 bytes from node2 (192.168.33.11): icmp_seq=1 ttl=64 time=1.44 ms
64 bytes from node2 (192.168.33.11): icmp_seq=2 ttl=64 time=0.341 ms
^C
--- node2 ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1001ms
rtt min/avg/max/mdev = 0.341/0.892/1.443/0.551 ms
$
```

Edit the ``/etc/mesos/zk`` file to point to the master node::

    zk://192.168.33.10:2181/mesos

Start up Mesos as a slave with:

```
$ sudo service mesos-slave start
```

Validate that it restarts:

```
$ sudo chkconfig mesos-slave on
$ sudo chkconfig mesos-master off
```

Further Study
-------------

* Validate that the ``/etc/hosts`` file is updated with all of the IP addresses.
* Add these IP addresses and node names to your *local* ``/etc/hosts`` file.
