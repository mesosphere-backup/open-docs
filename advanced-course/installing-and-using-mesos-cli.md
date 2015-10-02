---
layout: doc
title: Exercise 14 – Installing and Using Mesos CLI

redirect_from:
- /intro-course/ex14.html
---

This exercise gives you access to various files on the Apache Mesos cluster, among other features.
The best tool for doing this is the [Mesos CLI](https://github.com/mesosphere/mesos-cli) project which leverages
the latest APIs to give you a full suite of tools.

In this exercise:

1. Install Python's ``pip`` and ``virtualenv``.
2. Install the ``mesos.cli`` project onto node2.
3. Use the new ``mesos`` command to work with the cluster in various scenarios.

For more information on what is possible with Mesos CLI, see the [list of commands in the README](https://github.com/mesosphere/mesos-cli).


Video Lecture
-------------

{% mesos_video Meos-Intro-Lecture-14 %}


Quick Reference
---------------

Get ``mesos-cli``:

```
$ curl "https://bootstrap.pypa.io/get-pip.py" -o "get-pip.py"
$ sudo python get-pip.py
$ sudo pip install virtualenv
$ sudo pip install mesos.cli
```

If you see a "Requirement already satisfied" message when installing ``mesos.cli``, it means you currently have an old prepackaged version of the CLI installed. Perform an uninstall/reinstall to ensure that you get an up-to-date version of the CLI:

```
$ sudo pip uninstall mesos.cli
$ sudo pip install mesos.cli
```

Try the following sample commands. If you see errors about missing flags (eg ``--master``), then you are using the wrong version of the CLI and should perform the previous step.

```
$ mesos tail outyet stderr
$ mesos tail outyet stdout
```

Further Study
-------------

* Visit the [mesos-cli github project](https://github.com/mesosphere/mesos-cli) and read the README file to learn more.


