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

On ``node2``, install Mesos:

```
[node2]$ sudo rpm -Uvh http://repos.mesosphere.com/el/7/noarch/RPMS/mesosphere-el-repo-7-1.noarch.rpm
[node2]$ sudo yum -y install mesos
```

Update ``node2``'s ``/etc/hosts`` file to include entries for both nodes, *and* remove the "node2" name from the ``127.0.0.1`` entry on the first line. The file should look like this:

    127.0.0.1   localhost [.. other localhosts ..]
    ::1         localhost [.. other localhosts ..]
    192.168.33.10 node1
    192.168.33.11 node2

Now, if you do a ``ping node2`` then you should see ``192.168.33.11``:

```
[node2]$ ping node2
PING node2 (192.168.33.11) 56(84) bytes of data.
64 bytes from node2 (192.168.33.11): icmp_seq=1 ttl=64 time=0.043 ms
...
```

If node2 resolves to 127.0.0.1 then your first line is wrong.  *Remove* "node2" from the first line.

Edit the ``/etc/mesos/zk`` file on ``node2`` to point to the master node:

    zk://192.168.33.10:2181/mesos

Start up Mesos as a slave with:

```
[node2]$ sudo service mesos-slave start
```

Ensure that ``mesos-slave`` will be kept running across reboots/failures:

```
[node2]$ sudo chkconfig mesos-slave on
[node2]$ sudo chkconfig mesos-master off
[node2]$ systemctl list-unit-files | grep mesos
mesos-master.service                        disabled
mesos-slave.service                         enabled
```

``node2`` is now configured. 

Finally, switch over to ``node1`` and update ``/etc/hosts`` to look the same as on ``node2``, likewise ensuring that the "node1" name isn't present on the first line. Then verify the changes:

```
$ vagrant ssh node1
[node1]$ sudo vi /etc/hosts
[node1]$ ping node1
PING node1 (192.168.33.10) 56(84) bytes of data.
64 bytes from node2 (192.168.33.10): icmp_seq=1 ttl=64 time=0.08 ms
...
[node1]$ ping node2
PING node2 (192.168.33.11) 56(84) bytes of data.
64 bytes from node2 (192.168.33.11): icmp_seq=1 ttl=64 time=1.44 ms
...
```

Further Study
-------------

* Validate that the ``/etc/hosts`` files across both nodes have been updated with all IP addresses.
* Add these IP addresses and node names to your *local* ``/etc/hosts`` file.
