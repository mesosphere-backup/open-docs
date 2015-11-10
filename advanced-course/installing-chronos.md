---
layout: doc
title: Exercise 8 – Installing Chronos

redirect_from:
- /intro-course/ex8.html
- /tutorials/run-chronos-on-mesos/
---

Chronos is the cron of the Mesos ecosystem.  Chronos is used to schedule jobs
across the Mesos cluster and also manages dependencies between them in an
intelligent way.  This exercise shows you how to install Chronos and use it
to schedule simple tasks and a sample task dependency chain.

In this exercise:

1. Install Chronos.
2. Get Chronos running.
3. Create a simple periodic task by using the web UI.
4. Create a simple command with the REST API.



Video Lecture
-------------

{% mesos_video Mesos-Intro-Lecture-8 %}

Quick Reference
---------------

Install Chronos using ``yum`` and then start it with ``service``:

```
[node1]$ sudo yum -y install chronos
[node1]$ sudo service chronos start
```

Now you can go to the web UI for Chronos at http://192.168.33.10:4400/ and start a job.  Create one called "sleeper" that sleeps for 10 seconds and goes off every 10 minutes.


Further Study
-------------

* Stop Chronos and then install the ``/usr/bin/chronos`` command inside Marathon so that Marathon manages it the same way it manages Mesos DNS, ``SimpleHTTPServer``, and your demo application.
* Create a Chronos job that kills the Mesos DNS process every 5 minutes so that Marathon can restart it.  This task can be difficult, and is not recommended as a normal installation step.  It is *only intended to teach you about the connection between all of the pieces installed so far*.

