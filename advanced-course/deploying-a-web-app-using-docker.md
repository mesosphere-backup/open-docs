---
layout: doc
title: Exercise 12 – Deploying A Web App Using Docker

redirect_from:
- /intro-course/ex12.html
---

This exercise uses the Go project [Outyet](https://github.com/GeertJohan/outyet) to deploy a simple Go-based web application inside a Docker.

In this exercise:

1. Install Docker.
2. Compile the Outyet web application.
3. Build a Docker container that has the Outyet application in it.
4. Get the Docker container running in Marathon on ``node1``.


Video Lecture
-------------

{% mesos_video Mesos-Intro-Lecture-12 %}


Quick Reference
---------------

For this exercise I use the instructions found at https://blog.golang.org/docker for deploying the simple Outyet web application.
Borrowing from the Go instructions:

Install Docker:

```
[node1]$ sudo yum install -y golang git device-mapper-event-libs docker
[node1]$ sudo chkconfig docker on
[node1]$ sudo service docker start
[node1]$ export GOPATH=~/go
[node1]$ go get github.com/golang/example/outyet
```

The outyet project comes with a ``Dockerfile`` you can use, so ``cd`` to the source directory:

```
[node1]$ cd $GOPATH/src/github.com/golang/example/outyet
```

Use the ``Dockerfile`` to build your docker image:

```
[node1]$ sudo docker build -t outyet .
```

Test the ``Dockerfile`` before adding it to Marathon by running this command:

```
[node1]$ sudo docker run --publish 6060:8080 --name test --rm outyet
```

Then go to http://192.168.33.10:6060/ with your browser to confirm it works.  Once it does you can hit CTRL-c to exit the outyet docker.

Create a Marathon application that runs this command, but using the Marathon Docker support.  Once the ``outyet`` application
is loaded onto the VM you can create a new app using JSON and ``curl``.  First make the file names ``/vagrant/outyet.json``:

```
{
  "id": "outyet",
  "cpus": 0.2,
  "mem": 20.0,
  "instances": 1,
  "constraints": [["hostname", "UNIQUE", ""]],
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "outyet",
      "network": "BRIDGE",
      "portMappings": [
        { "containerPort": 8080, "hostPort": 0, "servicePort": 0, "protocol": "tcp" }
      ]
    }
  }
}
```

You will also need to tell mesos that it should allow Docker:

```
[node1]$ echo 'docker,mesos' | sudo tee /etc/mesos-slave/containerizers
[node1]$ sudo service mesos-slave restart
```

This replicates the above ``docker`` command settings, but Marathon will configure and manage the container better.  Once you have that
run this command:

```
[node1]$ curl -X POST http://192.168.33.10:8080/v2/apps -d @/vagrant/outyet.json -H "Content-type: application/json"
```

Later in this tutorial you will use this method to easily sync your configuration to Marathon.

Further Study
-------------

* Try configuring an application that you have into Docker and deploy that as well.
* Read the [Docker Documentation](https://docs.docker.com/) to better understand how it works.


