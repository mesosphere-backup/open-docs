---
layout: doc
title: Exercise 14 – Installing and Using Mesos CLI
---

This exercise gives you access to various files on the Apache Mesos cluster, among other features.
The best tool for doing this is the `Mesos CLI <https://github.com/mesosphere/mesos-cli>`_ project which leverages
the latest APIs to give you a full suite of tools.

In this exercise:

1. Install Python's ``pip`` and ``virtualenv``.
2. Install the ``mesos.cli`` project onto node2.
3. Use the new ``mesos`` command to work with the cluster in various scenarios.

For more information on what is possible with Mesos CLI, see the `list of commands in the README <https://github.com/mesosphere/mesos-cli>`_.


Video Lecture
-------------

{{ mesos.video("Meos-Intro-Lecture-14") }}


Quick Reference
---------------

Get ``mesos-cli``:

{{ mesos.code("ex14/install_mesos_cli.sh-session") }}

Try these sample commands:

{{ mesos.code("ex14/test_mesos_cli.sh-session") }}

Further Study
-------------

* Visit the `mesos-cli github project <https://github.com/mesosphere/mesos-cli>`_ and read the README file to learn more.


