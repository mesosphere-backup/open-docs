---
layout: doc
title: Mesosphere on a Single CoreOS Instance
---

## Introduction

This tutorial will walk you through setting up a Mesosphere cluster, which includes both [Apache Mesos](http://mesos.apache.org/) and [Marathon](http://mesosphere.github.io/marathon/), on a single CoreOS instance on DigitalOcean.

While a single instance cluster isn't production ready for most users, this is a good way to test Mesosphere on CoreOS. Once you have the cluster running, you'll be able to deploy an application to it using Marathon.

## Prerequisites

* A DigitalOcean account with [billing](https://cloud.digitalocean.com/billing) enabled.

## Set up a CoreOS droplet on DigitalOcean

For this tutorial, we'll use [DigitalOcean](http://digitalocean.com) to
quickly spin up a CoreOS virtual machine. After logging into DigitalOcean, click on the Create Droplet button on the [Droplets](https://cloud.digitalocean.com/droplets) page.

<img src="{% asset_path mesosphere-on-coreos/digitalocean-create-0.png %}" alt="" width="100%">

Configure your new droplet with a hostname, size and region of your choice. Be sure to select CoreOS as the operating system. For this tutorial, use the stable version. Hit create when finished!

<img src="{% asset_path mesosphere-on-coreos/digitalocean-create-1.png %}" alt="" width="100%">

In about a minute, you will see your new droplet in the DigitalOcean web UI.

<img src="{% asset_path mesosphere-on-coreos/digitalocean-create-2.png %}" alt="" width="100%">


## Configure services

Next, we'll set up the services that will run this cluster. In order to do this, we'll re-use some [systemd](https://coreos.com/using-coreos/systemd/) unit files provided by Mesosphere. These unit files specify four services:

1. ZooKeeper
2. Mesos master
3. Mesos slave
4. Marathon

These `systemd` unit files pull in Docker images built by Mesosphere, available in [the public Docker Hub registry](https://registry.hub.docker.com/u/mesosphere/).

***

Run the ssh command from your command line. Be sure to replace `1.2.3.4` with the external IP address of your newly created CoreOS instance on DigitalOcean. This will be shown next to the newly created droplet's name in [the list of droplets](https://cloud.digitalocean.com/droplets/).

```bash
ssh core@1.2.3.4
```

***

Next, clone the [Github repository](https://github.com/mesosphere/coreos-setup.git).


```bash
git clone https://github.com/mesosphere/coreos-setup.git
```

***

Copy the `systemd` unit files to `/etc/systemd/system`.

```bash
sudo cp coreos-setup/etc/systemd/system/*.service /etc/systemd/system
```

***

Replace the `<ZK_IP>` placeholders to the IP address of your newly created instance, replacing `1.2.3.4` in the command below with the actual IP address.

```bash
sudo sed -i 's/<ZK_IP>/1.2.3.4/g' /etc/systemd/system/*.service
```

## Run services

Enable the `systemd` services

```bash
sudo systemctl enable zookeeper.service \
                                            mesos-master.service \
                                            mesos-slave.service \
                                            marathon.service
```

***

Start the `systemd` services

```bash
sudo systemctl start zookeeper.service \
                                           mesos-master.service \
                                           mesos-slave.service \
                                           marathon.service
```

You can check that the services are running successfully by visiting `http://1.2.3.4:5050` to see the Mesos console or `http://1.2.3.4:8080` to see the Marathon console (again replacing `1.2.3.4` with your IP address).

## Run an application on Marathon

The following example will run a simple Python HTTP server using Marathon. The following command posts a JSON application definition to Marathon's [REST API](https://mesosphere.github.io/marathon/docs/rest-api.html). This will run two instances of the web service using a publicly available [Python 3](https://registry.hub.docker.com/_/python/) Docker image.

```bash
curl \
  -H "Content-Type: application/json" \
  http://1.2.3.4:8080/v2/apps \
  -d '
    {
      "id": "webapp",
      "cmd": "python3 -m http.server $PORT0",
      "cpus": 0.5,
      "mem": 64.0,
      "instances": 2,
      "container": {
        "type": "DOCKER",
        "docker": {
          "image": "python:3"
        }
      }
    }
  '
```

## Verify

### `docker ps`
Check that Zookeeper, Mesos master/slave, Marathon, and the sample Dockerized web app are all running.

```bash
core@mesos-coreos ~ $ docker ps
CONTAINER ID        IMAGE                            COMMAND                CREATED             STATUS              PORTS                                            NAMES
465f27dda027        python:3                         "/bin/sh -c 'python3   7 minutes ago       Up 7 minutes                                                         mesos-98af130c-a108-4a43-bf8b-29e427bd0fc8
9fec4693a7c7        python:3                         "/bin/sh -c 'python3   8 minutes ago       Up 8 minutes                                                         mesos-f25e7b2a-e1f3-405b-a549-0f7d8e4c40c4
628699e1c7b7        mesosphere/marathon:v0.7.5       "./bin/start --maste   29 seconds ago      Up 27 seconds       0.0.0.0:8080->8080/tcp, 0.0.0.0:9090->9090/tcp   marathon
ec9c30543c60        mesosphere/mesos-slave:0.20.1    "mesos-slave --ip=10   30 seconds ago      Up 28 seconds                                                        mesos_slave
ef3615ec13a5        mesosphere/mesos-master:0.20.1   "mesos-master --ip=1   30 seconds ago      Up 28 seconds                                                        mesos_master
2d6528281151        jplock/zookeeper:latest          "/opt/zookeeper-3.4.   30 seconds ago      Up 28 seconds                                                        zookeeper
```

### Marathon console

The Marathon console at `http://<public-ip>:8080` will show the newly created application.

<img src="{% asset_path mesosphere-on-coreos/marathon-ui.png %}" alt="" width="100%">

Clicking on the application will show you individual application instances. Clicking on the grey link under each instance ID will take you to the running web app.

<img src="{% asset_path mesosphere-on-coreos/marathon-ui-tasks.png %}" alt="" width="100%">

The web app will simply show you a directory listing.

<img src="{% asset_path mesosphere-on-coreos/web-server.png %}" alt="">

### Mesos console

The Mesos console at `http://<public-ip>:5050` will show the running tasks launched by Marathon.

<img src="{% asset_path mesosphere-on-coreos/mesos-ui.png %}" alt="" width="100%">


## Conclusion

**Congratulations!** You've successfully run Mesos and Marathon on a single CoreOS machine.
Our next tutorial in this series will describe how to extend this to multiple nodes.

In the meantime, check out our [other tutorials](/tutorials) to learn how Mesosphere can run your entire datacenter.

## Next Steps

+ [Set up a Mesosphere cluster on DigitalOcean](https://digitalocean.mesosphere.com/)
+ [Read our other tutorials](/tutorials)
