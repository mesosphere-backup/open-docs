---
layout: doc
title: Debugging a Mesosphere Cluster

redirect_to:
  - /intro-course/ex19.html
---

While Mesosphere's technology is a robust way to deploy services onto clusters with thousands of nodes, as with any large scale distributed system, tasks can and do fail. This tutorial walks through the typical first steps to debug issues.

## Prerequisites

* Mesosphere cluster on [Digital Ocean](https://digitalocean.mesosphere.com) or [Google Compute Engine](https://google.mesosphere.com)
* [VPN connection to the cluster](/getting-started/cloud/google/#vpn-setup)
* A running Mesos framework, Marathon application or Chronos job

## Debugging

Once you have a cluster created and are connected to its VPN, navigate to the [Mesosphere Launchpad](https://google.mesosphere.io/clusters) for cluster details.  From the Launchpad, select the cluster of interest and scroll to the consoles section.

<img src="{% asset_path learn/debugging/consoles.png %}" alt="Cluster Consoles" width="100%">

***

Click on the Mesos button to load the Mesos console and see an overview of your Mesos cluster (which will show Marathon, Chronos, and any other applications that have been launched).

<img src="{% asset_path learn/debugging/mesos-console.png %}" alt="Mesos Console" width="100%">

***

Click the **Frameworks** tab to see which frameworks are active and which resources are being used. For example, in the following screenshot, you see the HDFS framework is using 7 CPUs and 10.G GB of memory.

<img src="{% asset_path learn/debugging/mesos-console-frameworks.png %}" alt="Mesos Frameworks" width="100%">

***

Click the relevant link for framework in which you are interested. In the bar on the left you see staging tasks, active tasks, completed tasks, and lost or failed tasks. You also see activated and deactivated slaves.

<img src="{% asset_path learn/debugging/mesos-console-tasks.png %}" alt="Mesos Tasks" width="100%">

***

To debug a specific task, click the **Task ID**. Information about the task will appear in the bar on the left: Executor Name, Executor Source, Cluster, Master, and Resources.

<img src="{% asset_path learn/debugging/mesos-console-task.png %}" alt="Mesos Task" width="100%">

***

Click the **Sandbox** for the task, to check that your executor has been properly downloaded along with the appropriate URI’s (any config files, etc). If the executor has not been downloaded, the task will not run successfully. If URI’s used in your command or by the executor have not been downloaded, the task will not run successfully. The sandbox also shows the relevant logs, `stderr` and `stdout`, to use for debugging.

<img src="{% asset_path learn/debugging/mesos-console-sandbox.png %}" alt="Mesos Task Sandbox" width="100%">

<img src="{% asset_path learn/debugging/mesos-console-stderr.png %}" alt="Mesos Task Sandbox stderr" width="100%">

***

Click the **Slaves** tab, then click a particular slave, to view more information about it, including frameworks running, resources used, and a link to the log file. In this way you can debug tasks running on specific slaves.

<img src="{% asset_path learn/debugging/mesos-console-slave.png %}" alt="Mesos Slave" width="100%">

### Checking the Mesos Process

ssh into a master host to check the process using `ps -aux`.  On the master hosts, it is necessary that the Mesos master is up. If the master is not up or you are having trouble accessing your master console, you can run the command `sudo service mesos-master start`. You can then check the process list to see if there is a process with the name `mesos-master`.
Other useful commands are `sudo service mesos-master restart` or `sudo service mesos-slave restart` to restart the master or the slave.

<img src="{% asset_path learn/debugging/ssh-ps.png %}" alt="ssh ps" width="100%">


### Resource Starvation

One common issue is that your cluster runs out of resources, causing tasks to be added to the queue but not executed.

* To debug this on any Mesos framework, check the Mesos master log as well as the task logs.

* To debug this in Marathon, go to the Marathon console, [http://marathonip:8080/v2/queue](http://10.76.210.236:8080/v2/queue), to check the task queue.


### DCOS Command Line Interface

The DCOS CLI is an incredibly useful utility to access the same information that the Mesos console provides from the command line. It outputs information in same way as standard command line utilities, allowing for the output to be programmatically parsed. See the [DCOS CLI README](https://github.com/mesosphere/dcos-cli) for installation instructions and documentation.

***

Provide feedback or questions to [support@mesosphere.io](mailto:support@mesosphere.io).
