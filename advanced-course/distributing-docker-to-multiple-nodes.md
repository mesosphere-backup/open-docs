---
layout: doc
title: Exercise 13 – Distributing Docker To Multiple Nodes

redirect_from:
- /intro-course/ex13.html
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

{% mesos_video Mesos-Intro-Lecture-13 %}


Quick Reference
---------------

Save the Docker image:

```
[node1]$ sudo docker save --output=outyet.tar.gz outyet
```

Send the tar.gz file to ``node2``:

```
[node1]$ cp outyet.tar.gz /vagrant/
```

Install Docker on ``node2``:

```
$ vagrant ssh node2
[node2]$ sudo yum install -y device-mapper-event-libs docker
[node2]$ sudo chkconfig docker on
[node2]$ sudo service docker start
[node2]$ echo 'docker,mesos' | sudo tee /etc/mesos-slave/containerizers
[node2]$ sudo service mesos-slave restart
```

Import the ``outyet.tar.gz`` file that you made:

```
[node2]$ sudo docker load --input=/vagrant/outyet.tar.gz
```

Test that Docker is now installed on the ``node2`` VM:

```
[node2]$ sudo docker run --publish 6060:8080 --name test --rm outyet
```

Test that Docker is running on http://192.168.33.11:6060/.

Enter CTRL-C and go to Marathon and expand this to 2 nodes.  Watch the video to
see me doing it. At this point, hopefully you know how to go into Marathon and
instruct it to run more than one node.

Further Study
-------------

* On your *local host* computer, use ``tar -tzvf outyet.tar.gz`` to see what is inside it.

