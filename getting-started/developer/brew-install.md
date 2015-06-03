---
layout: doc
title: Installing Mesos onto a Mac with Homebrew
---

## Introduction

Homebrew makes it very easy to install Apache Mesos natively on a Mac. This tutorial covers the process of installing Mesosphere on your Mac. Note that Mesos was developed for and is intended to be used on Linux systems, so this will only be useful for testing purposes. We recommend the [Virtual Machine Installation Using Vagrant](/getting-started/developer/vm-install) instead for development.

### Prerequisite
Ensure the following applications are installed before continuing with setup.

* [Homebrew](http://brew.sh/) installed
* [curl](http://curl.haxx.se/download.html) installed
* [Java 1.7](http://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html) installed
* The following ports available (i.e. unbound): 2181, 5050, 5051, 8080

<a name="setup" ></a>
***
## Setup and Running

### Installation

<a name="install-mesos" ></a>
#### Mesos
To install Mesos, run:

```sh
brew install mesos
```

<div class="alert alert-info">
<strong>Note:</strong>
  This process requires Java 7 to be on the PATH with a properly configured JAVA_HOME.  Maven will be installed if it isn't present and it is required that Java 7 be used by maven for the build process to succeed.  <a href="https://stackoverflow.com/questions/18813828/why-maven-use-jdk-1-6-but-my-java-version-is-1-7">More detail</a> is available if your environment is not success because of this issue.
</div>
<div class="alert alert-info">
<strong>Note:</strong>
  This process could take upwards of 20 minutes, largely because `brew` compiles Mesos locally.
</div>


This standard brew process downloads, compiles, and links Mesos. Once finished, running `mesos` from the command line should give you output similar to:

```sh
Usage: mesos <command> [OPTIONS]

Available commands:
    help
    cat
    execute
    local
    log
    ps
    resolve
    scp
    tail
```

#### ZooKeeper

[Apache ZooKeeper](http://zookeeper.apache.org/) is currently required by Marathon. In a highly available Mesos installation, ZooKeeper would typically also be used for leader election.

To install ZooKeeper on your Mac, run:

```sh
brew install zookeeper
```

#### Install Marathon
<a name="install-marathon" ></a>

Marathon doesn't have a brew formula.  It is distributed as a tarball, which contains a runnable Java jar file, along with helpful scripts and examples.  Installation consists of downloading and extracting the tarball.

```sh
curl -O http://downloads.mesosphere.io/marathon/marathon-0.6.1/marathon-0.6.1.tgz
tar xzf marathon-0.6.0.tgz
```

### Running

#### Start ZooKeeper
<a name="start-master-in-memory" ></a>

In a new terminal window, start ZooKeeper:

```sh
zkServer start
```

#### Start Mesos

Spin up an in-memory Mesos master in another terminal window with the following command:

```sh
/usr/local/sbin/mesos-master --registry=in_memory --ip=127.0.0.1
```
<a name="start-slave-in-memory" ></a>

Open a new terminal window and launch a single Mesos slave:

```sh
sudo /usr/local/sbin/mesos-slave --master=127.0.0.1:5050
```

If these both launch successfully, you should be able to visit the [Mesos console](http://localhost:5050) at `http://localhost:5050`. This should show one slave under "Activated".

<img src="{% asset_path slave-web.png %}" alt="" width="400">

#### Start Marathon

To run Marathon, change into the directory where you extracted it and run the provided shell script to launch it:

```sh
cd marathon-0.6.0/
./bin/start --master localhost:5050 --zk zk://localhost:2181/marathon
```

If this launches successfully, you should now be able to access the [Marathon console](http://localhost:8080).

<img src="{% asset_path marathon-start.png %}" alt="" width="400">

### Verifying Installation

Now that the cluster is up and running, it is possible to run a simple task. Launch the following `mesos-execute` command:

{% highlight bash %}
mesos-execute --master="localhost:5050" --name="foobar" --command="sleep 5"
{% endhighlight %}

Besides the console output, which will show a task being created and changing status to `RUNNING` and then `FINISHED`, you should also see a newly terminated framework on the frameworks page of the Mesos console.

<img src="{% asset_path task-complete.png %}" alt="" width="400">

## Next Steps

{% include mesosphere/getting-started/next-steps-single-node.md %}
