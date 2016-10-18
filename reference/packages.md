---
layout: doc
title: Mesosphere Packages
redirect_to:
- https://dcos.io/
---

## Introduction

This page explains how to run and configure the Mesosphere packages.

To download packages or for information on how to set up Mesosphere repositories, see our [downloads page](https://mesosphere.com/downloads/).

## Apache Mesos Package

### Debian / Ubuntu


#### Services

To `(start | stop | restart)` mesos-master:

```sh
sudo service mesos-master (start | stop | restart)
```


To `(start | stop | restart)` mesos-slave:

```sh
sudo service mesos-slave (start | stop | restart)
```

Note that the mesos-master and mesos-slave processes are both activated by default. The .deb also depends on ZooKeeper, so this will run by default too after installation. If you want to disable these service from launching automatically on a reboot:

```sh
echo manual > /etc/init/mesos-master.override
echo manual > /etc/init/mesos-slave.override
echo manual > /etc/init/zookeeper.override
```


#### Configuration

The Mesosphere package ships with a default configuration, outlined below. For a detailed explanation of configuration options see the documentation on [master configuration](/reference/mesos-master/) and [slave configuration](/reference/mesos-slave/).

The default configuration includes:

* File: `/etc/default/mesos`
  - sets master and slave log dir to `/var/log/mesos`
* File: `/etc/default/mesos-master`
  - sets `port` to 5050
  - sets `zk` to the value in the file `/etc/mesos/zk`
* File: `/etc/default/mesos-slave`
  - sets `master` as the value of `/etc/mesos/zk`
* File: `/etc/mesos/zk`
  - sets the ZooKeeper instance to `zk://localhost:2181/mesos`
* File: `/etc/mesos-master/work_dir`
  - sets `working_dir` to `var/lib/mesos`
* File: `/etc/mesos-master/quorum`
  - sets `quorum` to `1`

This default configuration allows Mesos to start immediately on a single node.

See [Setting up a Mesosphere Cluster](/getting-started/datacenter/install) for full instructions on how to set up a high availability cluster.



### RedHat / CentOS Packages


#### Services

To `(start | stop | restart)` mesos-master:

```sh
sudo service mesos-master (start | stop | restart)
```


To `(start | stop | restart)` mesos-slave:

```sh
sudo service mesos-slave (start | stop | restart)
```

Note that the mesos-master and mesos-slave processes are both activated by default. The .deb also depends on ZooKeeper, so this will run by default too after installation. If you want to disable these service from launching automatically on a reboot:



#### Configuration

The Mesosphere package ships with a default configuration, outlined below. For a detailed explanation of configuration options see the documentation on [master configuration](/reference/mesos-master/) and [slave configuration](/reference/mesos-slave/).

The default configuration includes:

* File: `/etc/mesos/zk`
  - sets the expected zookeeper as `zk://localhost:2181/mesos`
* File: `/etc/default/mesos-master`
  - sets the master port to 5050
  - sets the zk to the value in the file `/etc/mesos/zk`
* File: `/etc/default/mesos-slave`
  - sets the slave flag for --master as the value of the zk file `/etc/mesos/zk`
* File: `/etc/mesos-master/registry`
  - sets the masters --registry to `in_memory`
* File: `/etc/default/mesos`
  - sets master and slave log dir to `/var/log/mesos`



### Other Useful Files

* Link: `/etc/systemd/system/multi-user.target.wants/mesos-master.service`
  - links to `/usr/lib/systemd/system/mesos-master.service`
* Link: `/etc/systemd/system/multi-user.target.wants/mesos-slave.service`
  - links to `/usr/lib/systemd/system/mesos-slave.service`
* File: ` /usr/lib/systemd/system/mesos-master.service`
  - enables `sudo service mesos-master start`
  - executes init script: `/usr/bin/mesos-init-wrapper` in master mode
* File: ` /usr/lib/systemd/system/mesos-slave.service`
  - enables `sudo service mesos-slave start`
  - executes init script: `/usr/bin/mesos-init-wrapper` in slave mode
* File: `/usr/bin/mesos-init-wrapper`
  - the Mesosphere init script

This default configuration allows Mesos to start immediately in a single node topology.

See [Setting up a Mesosphere Cluster](/getting-started/datacenter/install) for full instructions on how to set up a high availability cluster.
