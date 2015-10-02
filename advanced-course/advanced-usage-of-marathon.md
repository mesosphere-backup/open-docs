---
layout: doc
title: Exercise 17 – Advanced Usage of Marathon

redirect_from:
- /intro-course/ex17.html
---

After you have Ansible creating a repeatable build of your four node mini-cluster you'll want to also rebuild your Marathon configuration.  The Marathon GUI is good for basic Marathon usage, but the real power comes from using the Marathon REST API.  Using the REST API you can keep track of your configurations in a ``git`` repository, providing you with version control and use the API to change or rebuild your configurations as needed.

In this exercise:

1. Create a simple Marathon configuration repository with .json files for configuration.
2. Use ``curl`` to post them to Marathon as part of the Ansible build.
3. Add health checks to your Marathon tasks to ensure quality of service.
4. Configure SSL and a Basic Authentication password for Marathon to secure it.
5. Review the Marathon documentation to learn about other advanced topics.


Video Lecture
-------------

{% mesos_video Mesos-Intro-Course-17 %}


Quick Reference
---------------

In your VM directory make a ``marathon`` directory and get it started with ``git init``:

```
$ mkdir marathon
$ cd marathon
$ git init marathon
```

Make a ``webapp.json`` file:

```
{
  "id": "test",
  "cmd": "python -m SimpleHTTPServer $PORT0",
  "cpus": 0.5,
  "mem": 20.0,
  "instances": 4,
  "healthChecks": [
    {
      "protocol": "HTTP",
      "portIndex": 0,
      "path": "/",
      "gracePeriodSeconds": 5,
      "intervalSeconds": 20,
      "maxConsecutiveFailures": 3
    }
  ],
  "ports": [4000],
  "constraints": [
        ["hostname", "UNIQUE", ""]
    ]
}
```

Use this simple ``post.sh`` bash script to make it easier to load JSON files into Marathon:

```
#!/usr/bin/env bash
MARATHON=http://192.168.33.10:8080

for i in *.json
do
    curl -X POST $MARATHON/v2/apps -d @$i -H "Content-type: application/json"
done
```

This is simply using ``curl`` to loop through every .json file and then send it to Marathon with a POST HTTP request.
Run this to add your webapp to it:

```
$ cd marathon
$ chmod u+x post.sh
$ ./post.sh
```

Create the ``dns.json`` file for Mesos DNS:

```
{
  "id": "dns",
  "cmd": "sudo /home/vagrant/go/src/github.com/mesosphere/mesos-dns/mesos-dns -v=1 -config=/home/vagrant/go/src/github.com/mesosphere/mesos-dns/config.json",
  "cpus": 0.5,
  "mem": 20.0,
  "instances": 1,
  "ports": [4000],
  "constraints": [
        ["hostname", "CLUSTER", "node1"]
    ]
}
```

Create this ``outyet.json`` file to setup the outyet application:

```
{
  "id": "outyet",
  "cpus": 0.2,
  "mem": 20.0,
  "instances": 4,
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
  },
  "healthChecks": [
    {
      "protocol": "HTTP",
      "portIndex": 0,
      "path": "/",
      "gracePeriodSeconds": 5,
      "intervalSeconds": 20,
      "maxConsecutiveFailures": 3
    }
  ]
}
```

Run ``post.sh`` from the ``marathon`` directory to have it install your applications:

```
$ ./post.sh
```

Add this to your Ansible ``playbook.yml`` in the ``hosts: master`` section so that it's done during your build:

```
- name: start marathon services
  shell: cd /vagrant/marathon && sh post.sh
```

Additional Commands
-------------------

This automates your Marathon configuration and adds it to the Ansible ``playbook.yml`` file so that you can repeat it.  You'll also need to know the following common commands::

    # list out the apps availale
    curl http://192.168.33.10:8080/v2/apps

    # delete an app from Marathon
    curl -X DELETE http://192.168.33.10:8080/v2/apps/webapp

    # update the configuration of an app
    curl -X PUT http://192.168.33.10:8080/v2/apps/webapp -dwebapp.json -H "Content-type: application/json"

    # list the tasks of an app
    curl http://192.168.33.10:8080/v2/apps/webapp/tasks

    # delete the tasks of an app
    curl -X DELETE http://192.168.33.10:8080/v2/apps/webapp/tasks

Further Study
-------------

* Read more about the [API endpoints](https://mesosphere.github.io/marathon/docs/rest-api.html) available for Marathon.
