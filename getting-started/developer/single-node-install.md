---
layout: doc
title: Setting up a Single Node Mesosphere Cluster
---

## Introduction

This tutorial will walk you through setting up a Mesosphere cluster which includes [Apache Mesos](http://mesos.apache.org/) and [Marathon](http://mesosphere.github.io/marathon/).

In this tutorial, we assume that you are deploying a master and slave onto a single host for testing purposes. See [Setting up a Mesosphere Cluster](/getting-started/datacenter/install) if you require a fault-tolerant and highly available cluster.

+ [Setup](#setup)
+ [Verifying Installation](#verifying-installation)
+ [Next Steps](#next-steps)

<h2 id="setup">Setup </h2>

### Create a machine (optional)

If you need a machine to work on, one option is to [install vagrant](https://www.vagrantup.com) and execute the following for a new Ubuntu 64-bit VM:

```sh
mkdir vm-install
cd vm-install
vagrant init ubuntu/trusty64
vagrant up
vagrant ssh
```

### Package Installation

In this tutorial we will run both master and slave, ZooKeeper and Marathon on the same machine in a non-highly-available configuration.

#### Setup Repositories

The easiest way to install Mesosphere is via the Mesosphere repositories. Alternatively, you can download the latest `deb` or `rpm` directly from the <a href="http://mesosphere.com/downloads/" target="_blank">Mesosphere downloads page</a> and install it manually.

{% include downloads/repository-setup.md %}

#### Install

##### Debian / Ubuntu:

```sh
sudo apt-get -y install mesos marathon
```

The Mesos package will automatically pull in the ZooKeeper package as a dependency.

##### RedHat / CentOS:

```sh
sudo yum -y install mesos marathon
```

Since this package doesn't install ZooKeeper, you can install it as follows:

```sh
sudo rpm -Uvh http://archive.cloudera.com/cdh4/one-click-install/redhat/6/x86_64/cloudera-cdh-4-0.x86_64.rpm
sudo yum -y install zookeeper
sudo zookeeper-server-initialize --myid=1
```

### Configuration

The default configuration is good to go for a single node. For more details on the default configuration see [Mesosphere Packages](/reference/packages).

### Start Services

#### ZooKeeper

##### Debian / Ubuntu:

```sh
sudo service zookeeper restart
```

##### RedHat / CentOS:

```sh
sudo zookeeper-server start
```

#### Mesos &amp; Marathon

You need to bring each service up:

```sh
sudo service mesos-master start
sudo service mesos-slave start
sudo service marathon start
```

<h2 id="verifying-installation">Verifying Installation</h2>

If the packages were installed and configured correctly, you should be able to access the Mesos console at `http://<ip>:5050` and the Marathon console at `http://<ip>:8080` (where `<ip>` is the IP address of the node).

Another quick way to verify your cluster works is to launch a task through `mesos-execute`. We use `mesos-resolve` as a first step to get the Mesos master URL:

```sh
MASTER=$(mesos-resolve `cat /etc/mesos/zk` 2>/dev/null)
mesos-execute --master=$MASTER --name="cluster-test" --command="sleep 5"
```

Besides the console output, which will show a task being created and changing status to `RUNNING` and then `FINISHED`, you should also see a newly terminated framework on the frameworks page of the Mesos console.

<h2 id="next-steps">Next Steps</h2>

{% include mesosphere/getting-started/next-steps-single-node.md %}
