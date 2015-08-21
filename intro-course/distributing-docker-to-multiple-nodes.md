---
layout: doc
title: Exercise 13 – Distributing Docker To Multiple Nodes
---

After building the Docker image in Exercise 12, you can easily deploy the Outyet web application to your ``node2`` server.
You simply save the Docker and load it on ``node2`` and then tell Marathon to scale it.  This simple procedure lets you automate the deployment
of nearly any application that you can "dockerize".

In this exercise:

1. Save the Docker image to a file named ``outyet.tar.gz``.
2. Copy the Docker image to the ``/vagrant/`` directory in ``node1``.
3. Load the ``outyet.tar.gz`` docker container into ``node2``.
4. Use Marathon to scale Outyet to two nodes.


Video Lecture
-------------

{{ mesos.video("Mesos-Intro-Lecture-13") }}


Quick Reference
---------------

Save the Docker image:

{{ mesos.code("ex13/install_docker_node2.sh-session", section="node1save") }}

Send the tar.gz file to ``node2``:

{{ mesos.code("ex13/install_docker_node2.sh-session", section="node1copy") }}

Install Docker on ``node2``:

{{ mesos.code("ex13/install_docker_node2.sh-session", section="node2install") }}

Import the ``outyet.tar.gz`` file that you made:

{{ mesos.code("ex13/install_docker_node2.sh-session", section="import") }}

Test that Docker is now installed on the ``node2`` VM:

{{ mesos.code("ex13/install_docker_node2.sh-session", section="testrun") }}

Test that Docker is running on http://192.168.33.11:6060/.

Enter CTRL-C and go to Marathon and expand this to 2 nodes.  Watch the video to
see me doing it. At this point, hopefully you know how to go into Marathon and
instruct it to run more than one node.

Further Study
-------------

* On your *local host* computer, use ``tar -tzvf outyet.tar.gz`` to see what is inside it.

