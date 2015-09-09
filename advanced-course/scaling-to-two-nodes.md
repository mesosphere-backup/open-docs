---
layout: doc
title: Exercise 11 – Scaling To Two Nodes
---

After you have the ``mesos-slave`` running on ``node2``, you can use the Marathon GUI to expand the ``test`` Python web server out to ``node2`` and ``node1``.  This exercise is entirely video based.

In this exercise:

1. Use the Marathon GUI to scale up to 4 nodes.
2. Observe how ``node2`` now has the ``test`` application running in the Mesos GUI.

Video Lecture
-------------

{% mesos_video Mesos-Intro-Lecture-11 %}


Quick Reference
---------------

1. View the two Mesos nodes in the Marathon GUI and see how they are displayed.
2. Use the Marathon GUI to scale down your nodes to 0, then with the newly added ``node2`` active, scale it back up to 4 so you can see them be distributed across the little cluster.
3. Use mesos-dns to discover where they are and what their ports are.


Further Study
-------------

* Use mesos-dns to find out where they are located.
* Try launching your own commands to see how they work.
