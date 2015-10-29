---
layout: doc
title: Setting up a Mesos and Marathon Cluster
redirect_from: /getting-started/datacenter/install/
---

## Introduction

This tutorial will walk you through setting up a cluster which includes [Apache Mesos](http://mesos.apache.org/) and [Marathon](https://github.com/mesosphere/marathon).

In this tutorial, we assume that you are deploying masters and slaves in a fault-tolerant way to multiple discrete hosts. 

+ [Master Node Setup](#master-setup)
+ [Slave Node Setup](#slave-setup)
+ [Verifying Installation](#verifying-installation)
+ [Next Steps](#next-steps)

<h2 id="master-setup">Master Nodes Setup </h2>

### Package Installation

Highly-available clusters will typically have multiple master nodes and any number of slave nodes. Each master node runs Apache Mesos, Marathon and ZooKeeper (to provide leader election).

Running three ZooKeeper nodes will allow one to fail and for the service to still be available (see [ZooKeeper reliability](http://stackoverflow.com/questions/13022244/zookeeper-reliability-three-versus-five-nodes) for more information). We recommend running **at least three master nodes** for a highly-available configuration. Run the steps below on each master node.

#### Setup Repositories

The easiest way to install Mesos is via the GitHub repositories. Alternatively, you can download the latest `deb` or `rpm` directly from the [Mesosphere downloads page](/downloads/mesos) and install it manually.

{% include downloads/repository-setup.md %}

#### Install

##### Debian / Ubuntu:

```sh
sudo apt-get -y install mesos marathon
```

The Mesos package will automatically pull in the ZooKeeper package as a dependency.

##### RedHat 6 / CentOS 6:

```sh
sudo yum -y install mesos marathon
```

Since this package doesn't install ZooKeeper, you can install it as follows:

```sh
sudo rpm -Uvh http://archive.cloudera.com/cdh4/one-click-install/redhat/6/x86_64/cloudera-cdh-4-0.x86_64.rpm
sudo yum -y install zookeeper
```

You will need to install ZooKeeper separately on each master node. We recommend the [Cloudera package](http://www.cloudera.com/content/cloudera-content/cloudera-docs/CDH4/latest/CDH4-Installation-Guide/cdh4ig_topic_21_3.html).

##### RedHat 7 / CentOS 7:

```sh
sudo yum -y install mesos marathon
```

Since this package doesn't install ZooKeeper, you can install it as follows:

```sh
sudo yum -y install mesosphere-zookeeper
```

### Configuration

For more details on the default configuration see [Mesos Packages](/reference/packages).


#### ZooKeeper

##### Setting ID

###### Debian / Ubuntu:

Set `/etc/zookeeper/conf/myid` to a unique integer between 1 and 255 on each node.

###### RedHat 6 / CentOS 6:
Run `sudo zookeeper-server-initialize --myid=<INT>` with a unique integer between 1 and 255 on each node.

###### RedHat 7 / CentOS 7:

Set `/var/lib/zookeeper/myid` to a unique integer between 1 and 255 on each node.

##### Server Addresses

Append the following values to `/etc/zookeeper/conf/zoo.cfg` on each node, replacing the IP addresses with your own:

```sh
server.1=1.1.1.1:2888:3888
server.2=2.2.2.2:2888:3888
server.3=3.3.3.3:2888:3888
```

For advanced configuration see the [ZooKeeper Administrator's Guide](https://zookeeper.apache.org/doc/r3.3.3/zookeeperAdmin.html). Pay attention in particular to the [Maintenance section](https://zookeeper.apache.org/doc/r3.3.3/zookeeperAdmin.html#sc_maintenance) which contains important information about disk space usage and cleanup.

##### Start ZooKeeper

###### Debian / Ubuntu:

```sh
sudo service zookeeper restart
```

###### RedHat 6 / CentOS 6:

```sh
sudo zookeeper-server start
```

###### RedHat 7 / CentOS 7:

```sh
sudo systemctl start zookeeper
```

#### Mesos &amp; Marathon

##### ZooKeeper
On each node, replacing the IP addresses below with each master's IP address, set `/etc/mesos/zk` to:

```sh
zk://1.1.1.1:2181,2.2.2.2:2181,3.3.3.3:2181/mesos
```

##### Quorum

Set `/etc/mesos-master/quorum` on each master node to a number **greater than the number of masters divided by 2**. For example, the optimal quorum size for a five node master cluster would be `3`. In this case, there are three masters and the quorum size should be set to `2` on each node.

```sh
2
```

##### Hostname (optional)

If you're unable to resolve the hostname of the machine directly (e.g., if on a different network or using a VPN), set `/etc/mesos-master/hostname` to a value that you can resolve, for example, an externally accessible IP address or DNS hostname. This will ensure all links from the Mesos console work correctly.

You will also want to set this property in `/etc/marathon/conf/hostname`.

##### Disable `mesos-slave` service

On Ubuntu:

```sh
sudo service mesos-slave stop
sudo sh -c "echo manual > /etc/init/mesos-slave.override"
```

On Debian / RedHat 6 / Centos 6

```sh
sudo service mesos-slave stop
sudo update-rc.d -f mesos-slave remove
```

On RedHat 7 / Centos 7

```sh
systemctl stop mesos-slave.service
systemctl disable mesos-slave.service
```

### Restart Services

You need to bring each service up on the set of master nodes at roughly the same time. Bring up Mesos master:

```sh
sudo service mesos-master restart
```

Then restart Marathon:

```sh
sudo service marathon restart
```

<h2 id="slave-setup">Slave Node Setup </h2>

### Package Installation

Run a number of slaves that is proportional to your workload. It's very easy to add slaves later to a Mesos cluster.

#### Setup Repositories

The easiest way to install Mesos is via the GitHub repositories. Alternatively, you can download the latest `deb` or `rpm` directly from the [Mesos downloads page](/downloads/mesos) and install it manually.

{% include downloads/repository-setup.md %}

#### Install from package

##### Debian / Ubuntu:

```sh
sudo apt-get -y install mesos
```

##### RedHat / CentOS:

```sh
sudo yum -y install mesos
```

### Configuration

For more details on the default configuration see [Mesos Packages](/reference/packages).


#### Disable ZooKeeper

If you're using the Debian or Ubuntu package, ZooKeeper will be pulled in and installed as a dependency automatically.

On Ubuntu:

```sh
sudo service zookeeper stop
sudo sh -c "echo manual > /etc/init/zookeeper.override"
```

On Debian

```sh
sudo service zookeeper stop
sudo update-rc.d -f zookeeper remove
```

#### Mesos

##### ZooKeeper
On each node, replacing the IP addresses below with each master's IP address, set `/etc/mesos/zk` to:

```sh
zk://1.1.1.1:2181,2.2.2.2:2181,3.3.3.3:2181/mesos
```

##### Hostname (optional)

If you're unable to resolve the hostname of the machine directly (e.g., if on a different network or using a VPN), set `/etc/mesos-slave/hostname` to a value that you can resolve, for example, an externally accessible IP address or DNS hostname. This will ensure all links from the Mesos console work correctly.

You will also want to set this property in `/etc/marathon/conf/hostname`.

##### Disable `mesos-master` service

On Ubuntu:

```sh
sudo service mesos-master stop
sudo sh -c "echo manual > /etc/init/mesos-master.override"
```

On Debian / RedHat 6 / CentOS 6:

```sh
sudo service mesos-master stop
sudo update-rc.d -f mesos-master remove
```

On RedHat 7 / CentOS 7:

```sh
sudo systemctl stop mesos-master.service
sudo systemctl disable mesos-master.service
```

### Start Services

Restart mesos-slave on each node to use the new configuration:

```sh
sudo service mesos-slave restart
```

<h2 id="verifying-installation">Verifying Installation</h2>

If the packages were installed and configured correctly, you should be able to access the Mesos console at `http://<master-ip>:5050` and the Marathon console at `http://<master-ip>:8080` (where `<master-ip>` is any of the master IP addresses).

Another quick way to verify your cluster works is to launch a task through `mesos-execute` from any of the newly provisioned nodes:

```sh
MASTER=$(mesos-resolve `cat /etc/mesos/zk`)
mesos-execute --master=$MASTER --name="cluster-test" --command="sleep 5"
```

Besides the console output, which will show a task being created and changing status to `RUNNING` and then `FINISHED`, you should also see a newly terminated framework on the frameworks page of the Mesos console.

<h2 id="next-steps">Next Steps</h2>

Check out the [tutorials](/tutorials/) to see how to enable Docker support, run popular web applications and big data frameworks like Spark and Hadoop. 
