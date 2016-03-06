---
layout: doc
title: Exercise 5 – Using the Marathon GUI

redirect_from:
- /intro-course/ex5.html
---

You can use the Marathon GUI to configure and deploy your applications. In this exercise you will learn how the GUI works and
how to configure and control a simple Python web service.

This exercise is entirely video based. In this exercise:

1. Use the command line to kill the python web server.
2. Watch Marathon bring the Python web server back up.
3. Learn how to scale the app and halt the process.
4. Learn how to use ``$PORT`` to let Marathon assign random ports to your applications.
5. Scale the apps further than 1 node using randomly assigned ports.


Video Lecture
-------------

{% mesos_video Mesos-Intro-Lecture-5 %}


Quick Reference
---------------

This exercise is entirely video based, and in the video we:

1. Kill the Python process from exercise 4.
2. Watch the Python process recover.
3. Suspend the Python process which brings it to 0.
4. Bring the process back up by going from 0 to 1 nodes.
5. Make a new Python process with different values for CPU and RAM. Make sure you can fit more than one process in the cluster according to the values you choose for CPU and RAM (recommended defaults: 0.1 CPU and 32MB RAM)
6. Scale the Python process back up by using the ``$PORT`` variable and then add more nodes.
7. Add 2 more nodes then show the ports working dynamically.

Further Study
-------------

* Try out all of the things shown in the video on your application that was started in exercise 4.
* With the ``$PORT`` variable you can have both the ``SimpleHTTPServer`` and your application live together.  Try it out!

