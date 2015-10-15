---
layout: doc
title: Exercise 17 – Advanced Usage of Marathon

redirect_from:
- /intro-course/ex17.html
- /advanced-course/advanced-usage-of-the-marathon
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

In your VM directory, create a ``marathon`` subdirectory and go into it:

```
$ mkdir marathon; cd marathon
```

Within the ``marathon`` directory, create a new configuration file named ``webapp.json``:

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

Create a ``post.sh`` helper script for loading JSON-formatted service configuration data into Marathon:

```
#!/usr/bin/env sh
MARATHON=http://192.168.33.10:8080

for file in *.json
do
  echo "Installing $file..."
  curl -X POST "$MARATHON/v2/apps" -d @"$file" -H "Content-type: application/json"
  echo ""
done
```

The script will iterate over every ``.json`` file in the current directory, adding each to Marathon with an HTTP POST request. Execute the script now to submit the ``webapp.json`` configuration which was created earlier:

```
$ sh post.sh
```

With that working, we can add configurations for the other Marathon services we want to run. Create a Marathon service config named ``dns.json`` for Mesos DNS:

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

Create a Marathon service config named ``outyet.json`` for the Outyet Docker application. This configuration includes a ``heathChecks`` section for automatically restarting unresponsive instances:

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

Add the above Mesos DNS and Outyet services to Marathon by running ``post.sh`` once more:

```
$ sh post.sh
```

Now, add an entry to the bottom of the ``hosts: master`` section of your Ansible ``playbook.yml`` file. This will ensure that Marathon service configurations are automatically created as a part of Ansible setup:

```
- name: configure marathon services
  shell: cd /vagrant/marathon && sh post.sh
```

Additional Commands
-------------------

Marathon supports many HTTP commands to read current status and to make configuration changes:

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

* Read more about Marathon's [API endpoints and config schema](https://mesosphere.github.io/marathon/docs/rest-api.html).
