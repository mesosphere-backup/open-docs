---
layout: doc
title: Exercise 12 – Deploying A Web App Using Docker
---

This exercise uses the Go project `Outyet <https://github.com/GeertJohan/outyet>`_ to deploy a simple Go-based web application inside a Docker.

In this exercise:

1. Install Docker.
2. Compile the Outyet web application.
3. Build a Docker container that has the Outyet application in it.
4. Get the Docker container running in Marathon on ``node1``.


Video Lecture
-------------

{{ mesos.video("Mesos-Intro-Lecture-12") }}


Quick Reference
---------------

For this exercise I use the instructions found at https://blog.golang.org/docker for deploying the simple Outyet web application.
Borrowing from the Go instructions:

Install Docker:

{{ mesos.code("ex12/install_outyet.sh-session", section="start") }}

The outyet project comes with a ``Dockerfile`` you can use, so ``cd`` to the source directory:

{{ mesos.code("ex12/install_outyet.sh-session", section="builddir") }}

Use the ``Dockerfile`` to build your docker image:

{{ mesos.code("ex12/install_outyet.sh-session", section="build") }}

Test the ``Dockerfile`` before adding it to Marathon by running this command:

{{ mesos.code("ex12/install_outyet.sh-session", section="run") }}

Then go to http://192.168.33.10:6060/ with your browser to confirm it works.  Once it does you can hit CTRL-c to exit the outyet docker.

Create a Marathon application that runs this command, but using the Marathon Docker support.  Once the ``outyet`` application
is loaded onto the VM you can create a new app using JSON and ``curl``.  First make the file names ``/vagrant/outyet.json``:

{{ mesos.code("ex12/outyet.json") }}

You will also need to tell mesos that it should allow Docker:

{{ mesos.code("ex12/enable_docker.sh-session") }}

This replicates the above ``docker`` command settings, but Marathon will configure and manage the container better.  Once you have that
run this command:

{{ mesos.code("ex12/post_config.sh-session") }}

Later in this tutorial you will use this method to easily sync your configuration to Marathon.

Further Study
-------------

* Try configuring an application that you have into Docker and deploy that as well.
* Read the `Docker Documentation <https://docs.docker.com/>`_ to better understand how it works.


