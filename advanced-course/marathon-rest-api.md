---
layout: doc
title: Exercise 6 – Marathon REST API

redirect_from:
- /intro-course/ex6.html
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

{% mesos_video Mesos-Intro-Lecture-6 %}


Quick Reference
---------------

The Marathon REST API is documented at http://mesosphere.github.io/marathon/docs/rest-api.html and to demonstrate it you do the following:

```
# get metrics on the running apps
[node1]$ curl http://0.0.0.0:8080/metrics | python -m json.tool | less

# look at the apps you have installed
[node1]$ curl http://0.0.0.0:8080/v2/apps | python -m json.tool

# look at a specific app, named test from Ex4 and Ex5
[node1]$ curl http://0.0.0.0:8080/v2/apps/test | python -m json.tool

# delete that app
[node1]$ curl -X DELETE http://0.0.0.0:8080/v2/apps/test | python -m json.tool

# show that the app is gone
[node1]$ curl http://0.0.0.0:8080/v2/apps/test | python -m json.tool
```

Confirm that these commands cause changes in the Marathon GUI as you run them.  After that bring back the ``python`` test application using either the GUI, or for extra point, the API and ``curl``.

Further Study
-------------

* Do the inverse of this video and make changes in the Marathon GUI which are shown in the REST API.
* Use the REST API, ``curl`` and your text editor to ``DELETE`` and redeploy your application from the command line only.

