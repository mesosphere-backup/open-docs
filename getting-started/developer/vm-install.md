---
layout: doc
title: Virtual Machine Installation using Vagrant

redirect_to:
  - /intro-course/ex1.html
---

## Introduction

The [playa-mesos](https://github.com/mesosphere/playa-mesos) project allows you to run Mesosphere in a single node configuration in a virtual machine. This includes Apache ZooKeeper, Apache Mesos and Marathon.

### Prerequisite

You will need the following items installed:

* [VirtualBox 4.2+](http://www.virtualbox.org/)
* [Vagrant](http://www.vagrantup.com/)
* [git](http://git-scm.com/downloads)

## Setup

### Clone `playa-mesos`

These commands will clone the `playa-mesos` repository locally:

```sh
git clone https://github.com/mesosphere/playa-mesos.git
cd playa-mesos
```

### Check the local environment

```sh
./bin/test
```

This command will run tests to verify your local environment is configured correctly.   The output should look something like:

```sh
VirtualBox version discovered: 4.3
Vagrant version discovered: 1.4
all 8 playa-mesos tests passed in 1s.
```

### Start the virtual machine

From the root of the project directory:

```sh
vagrant up
```

<div class="alert alert-info">
<strong>Note:</strong>
This will begin a download the first time it is run.  This will download a 788MB VirtualBox image, and, depending on the speed of your internet connection, should take less than 10 minutes.
</div>

Once completed, this will bring up the virtual machine with an IP address of `10.141.141.10`.  Running inside the virtual machine is Apache ZooKeeper, Apache Mesos, and Marathon.

### Verifying Installation

You can verify that the cluster is up by navigating to the [Mesos console](http://10.141.141.10:5050/) or the [Marathon console](http://10.141.141.10:8080/).


Another quick way to verify your cluster works is to launch a Mesos task on it. You can do this with the `mesos-execute` tool after logging into the virtual machine via `vagrant ssh`.

First ssh into the machine:

```sh
vagrant ssh
```

We're going to find the URL of the Mesos master using `mesos-resolve`, then create a new task on it. Execute the following commands:

```sh
MASTER=$(mesos-resolve `cat /etc/mesos/zk` 2>/dev/null)
mesos-execute --master=$MASTER --name="cluster-test" --command="sleep 5"
```

Besides the console output, which will show a task being created and changing status to `RUNNING` and then `FINISHED`, you should also see a newly terminated framework on the frameworks page of the Mesos console.

### Updating Mesosphere Packages

The virtual machine comes pre-configured to get packages from the Mesosphere repository.
To upgrade Mesos and Marathon to the latest stable version, do:

```sh
sudo apt-get update
sudo apt-get install -y mesos marathon
```

## Tearing Down
When you are finished working with the virtual machine, you can bring it down by running `vagrant halt` in the root of the project directory. If you wish to teardown the virtual machine entirely, also run `vagrant destroy`.


## Next Steps

Check out the [Mesosphere tutorials](/tutorials/) to see how to enable Docker support, run popular web applications and big data frameworks like Spark and Hadoop. To set up a fault-tolerant and highly available cluster, see [Setting up a Mesos and Marathon Cluster](/getting-started/datacenter/install/). For more information on best practices in production, see [Mesosphere in Production](/getting-started/datacenter/production-setup/)

