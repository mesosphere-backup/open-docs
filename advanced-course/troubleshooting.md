---
layout: doc
title: Exercise 19 – Troubleshooting

redirect_from:
- /intro-course/ex19.html
---

This exercise teaches you how to debug your tiny cluster when things go
wrong.

In this exercise:
* Cause errors and then use the tools available to you to troubleshoot.
* Reconfigure rsyslog so that it routes all of the Mesos, Chronos, and Marathon messages to ``/var/log/mesos/`` files
rather than to the ``/var/log/messages`` file.


Video Lecture
-------------

{% mesos_video Mesos-Intro-Course-19 %}


Quick Reference
---------------

When there are problems they are stored here by default:

* The ``/var/log/mesos`` directory contains many logging files.
* The ``/var/log/messages`` file contains many of the syslog messages.

To simplify troubleshooting, create a configuration file in ``/etc/rsyslog.d/`` that sorts the messages into four different message types: Marathon, Chronos, Mesos master, and Mesos slave.  Create the file ``/etc/rsyslog.d/mesos.conf`` with these contents:


```
if $programname == 'marathon' then {
   action(type="omfile" file="/var/log/mesos/marathon.log")
}

if $programname == 'chronos' then {
   action(type="omfile" file="/var/log/mesos/chronos.log")
}

if $programname == 'mesos-master' then {
   action(type="omfile" file="/var/log/mesos/mesos-master.log")
}

if $programname == 'mesos-slave' then {
   action(type="omfile" file="/var/log/mesos/mesos-slave.log")
}
```

Restart ``rsyslog`` to verify that this configuration works:

```
[node1]$ sudo service rsyslog restart
```

If successful, you should see new log files in ``/var/log/mesos/``:

    1. ``/var/log/mesos/marathon.log`` contains the Marathon related messages.
    2. ``/var/log/mesos/chronos.log`` contains the Chronos relates messages.
    3. ``/var/log/mesos/mesos-master.log`` has the Mesos master messages.
    4. ``/var/log/mesos/mesos-slave.log`` has the Mesos slave messages.

In general you'll put this on the mesos master nodes you make, but you could cut this down and also put it on the slave nodes too for just the slave messages.

Copy it to the ``/vagrant/mesos.conf.j2`` file:

```
[node1]$ cp /etc/rsyslog.d/mesos.conf /vagrant/mesos.conf.j2
```

Add this configuration to the Ansible ``playbook.yml`` so this is fixed in the Master:

```
      - name: update the rsyslog config
        template: src=./mesos.conf.j2 dest=/etc/rsyslog.d/mesos.conf
      - name: restart rsyslog
        shell: service rsyslog restart
```

You should put this directly after you update the hosts file.

Finding Errors
--------------

With your messages files sorted, it's easier to troubleshoot.  A good place to start your troubleshooting process is in ``/var/log/mesos/marathon.log`` to see what Marathon thinks is going
on.  The Marathon messages are no longer mixed together with Mesos and Chronos errors.

Another place to look is in the Mesos web UI at http://192.168.33.10:5050/ where you can see each node's Sandbox.  Watch the video for more information on this.

You can also use the ``dcos task log --follow <task> <file>`` command from the DCOS CLI to watch the ``stderr/stdout`` of any listed command while you're trying to debug a problem.


Further Study
-------------

* Configure the ``rsyslogd`` for the slave nodes as well.

