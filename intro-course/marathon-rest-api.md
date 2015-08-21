---
layout: doc
title: Exercise 6 – Marathon REST API
---

The GUI is the primary way to work with Marathon, but it's also good to
understand the underlying REST interface for Marathon.  This exercise will show
you advanced tricks you can do right from the command line using the Marathon
REST API.  You don't need to know any programming languages to complete this
exercise, just a basic understanding of the ``curl`` command line HTTP tool.

In this exercise you'll see how these REST calls map to the Marathon GUI and the Marathon
command line tool.

Video Lecture
-------------

{{ mesos.video("Mesos-Intro-Lecture-6") }}


Quick Reference
---------------

The Marathon REST API is documented at http://mesosphere.github.io/marathon/docs/rest-api.html and to demonstrate it you do the following:

{{ mesos.code("ex6/api_tests.sh-session") }}

Confirm that these commands cause changes in the Marathon GUI as you run them.  After that bring back the ``python`` test application using either the GUI, or for extra point, the API and ``curl``.

Further Study
-------------

* Do the inverse of this video and make changes in the Marathon GUI which are shown in the REST API.
* Use the REST API, ``curl`` and your text editor to ``DELETE`` and redeploy your application from the command line only.

