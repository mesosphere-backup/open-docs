---
layout: doc
title: Launching a Docker Container on Mesosphere
---

> [Docker](https://www.docker.io/) aids software deployment through the automation of Linux Containers (LXC). While Docker has made the the life of developers and operators easier, Docker plus Mesosphere provides an easy way to automate and scale deployment of containers in a production environment.

> Mesos is a technology that has been proven to provide fault-tolerance and scale at Twitter, OpenTable and HubSpot, just to name a few. Version 0.20 added native Docker support.

## Prerequisites

* Mesosphere cluster running Mesos 0.20+ and Marathon 0.7.0+ or Chronos 2.3.0+.

<div class="alert alert-info">
  <strong>Note:</strong> Elastic Mesos on Amazon uses Mesos 0.19 and does **NOT** support Docker!
</div>


## Setting Up

These instructions will walk through the deployment of [libmesos/ubuntu](https://registry.hub.docker.com/u/libmesos/ubuntu/) Docker image.

This article references the Mesos and Marathon web consoles.  Access to these consoles is available at the IP address or hostname of the master node through a browser.  Mesos is available at `http://<master>:5050` and Marathon is available at `http://<master>:8080`.

### Setting up your cluster for Docker support

#### Install Docker

Docker version 1.0.0 or later needs to be installed on each slave node. Full instructions are available on Docker's [website](http://docs.docker.com/installation/).

#### Configure mesos-slave

  <div class="alert alert-info">
    <strong>Note:</strong> All commands below assume `mesos-slave` is being run
    as a service using the package provided by
    Mesosphere.
  </div>

1. Update slave configuration to specify the use of the Docker containerizer
  <div class="alert alert-info">
    <strong>Note:</strong> The order of the parameters to `containerizers` is important.
    It specifies the priority used when choosing the containerizer to launch
    the task.
  </div>

    ```bash
    $ echo 'docker,mesos' > /etc/mesos-slave/containerizers
    ```

2. Increase the executor timeout

    ```bash
    $ echo '5mins' > /etc/mesos-slave/executor_registration_timeout
    ```

3. Restart `mesos-slave` process to load the new configuration

## Deployment through Chronos

Deployment of Docker containers is supported via Chronos' [REST API](https://github.com/mesos/chronos#api).  Chronos is a fault tolerant distributed scheduler for jobs that includes ISO8601 support and dependency based job scheduling.

In order to deploy a Docker container we need to POST a JSON job description to `http://<master>:4400/scheduler`.  Below is the Docker.json file.

```javascript
{
 "schedule": "R\/2014-09-25T17:22:00Z\/PT2M",
 "name": "dockerjob",
 "container": {
   "type": "DOCKER",
   "image": "libmesos/ubuntu"
 },
 "cpus": "0.5",
 "mem": "512",
 "uris": [],
 "command": "while sleep 10; do date -u +%T; done"
}
```

The file can be posted with <kbd>curl</kbd> to Chronos using the command `curl -L -H "Content-Type: application/json" -X POST -d@Docker.json`
`http://<master>:4400/scheduler/iso8601`, replacing `<master>` with the IP address of your Mesosphere master.  Please note that this specification is for a scheduled job.  For a dependency based job, simply update the parameters to remove the schedule and add parents as well as updating the post request.

Using the Chronos web console (at `http://<master>:4400/`), you will see the newly created job. It should appear as 'FRESH'.  Launching a Docker task requires the slave running the image to perform a `docker pull`, which can take several minutes the first time. To see the job running and check the logs, you can visit the Mesos master web console.  When the job is completed, the Chronos job should appear as 'SUCCESS'.

<img src="{% asset_path chronos-docker.png %}" alt="" width="60%">

## Deployment through Marathon

Deployment of Docker containers is supported via Marathon's [REST API](https://mesosphere.github.io/marathon/docs/rest-api.html).  Marathon is a cluster-wide init and control service for services as well as long running jobs.

In order to deploy a Docker container we need to POST a JSON task description to `http://<master>:8080/apps`.  Below is the Docker.json file.

```javascript
{
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "libmesos/ubuntu"
    }
  },
  "id": "ubuntu",
  "instances": 1,
  "cpus": 0.5,
  "mem": 512,
  "uris": [],
  "cmd": "while sleep 10; do date -u +%T; done"
}
```

The file can be posted with <kbd>curl</kbd> to Marathon using the command `curl -X POST -H "Content-Type: application/json" http://<master>:8080/v2/apps -d@Docker.json`, replacing `<master>` with the IP address of your Mesosphere master.

Using the Marathon web console (at `http://<master>:8080/`), you will see the newly created application. There should be an instance count of `0/1`.  Launching a Docker task requires the slave running the image to perform a `docker pull`, which can take several minutes the first time. When it is completed, Marathon instances should change to `1/1`.

<img src="{% asset_path marathon-docker.png %}" alt="" width="60%">

## Scaling up with Marathon

Marathon makes scaling easy!  Notice in the last illustration above the "Scale" button.  Click the button and pick a number.  For this example, lets enter 3, then submit with "OK".

Upon submission the tasks screen will change to indicate there are new tasks in "Staging" status.

<img src="{% asset_path marathon-docker-scaling.png %}" alt="" width="60%">

It is just as easy to scale down.  One option for scaling down is to select the "Scale" button again and provide a smaller number (for instance 2).  In this case, Marathon will select a task to kill for you.  Another option is to select a check box next to a task ID.

<img src="{% asset_path marathon-docker-kill.png %}" alt="" width="60%">

When a task is selected, additional options are provided.  By selecting "Kill & Scale", Marathon will kill that task and will scale down to the remain number of tasks.

## Summary

In this tutorial, we deployed and scaled a simple Docker image. For more detailed docs related to using Docker with Marathon, see [the Marathon docs](https://mesosphere.github.io/marathon/docs/native-docker.html).
