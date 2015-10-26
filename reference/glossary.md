---
layout: doc
title: DCOS Terminology 
---

Datacenter operating system

: A new class of operating system that spans all of the machines in a datacenter or cloud and organizes them to act as one big computer.


DCOS

: The abbreviated form of the Mesosphere Datacenter Operating System.


DCOS Cluster

: A group of nodes.


DCOS Service

: A DCOS service is a datacenter service that is installable from the public <a href="https://github.com/mesosphere/universe" target="_blank">Mesosphere repository</a>. For example, HDFS, Spark, and Cassandra are DCOS services. For more information, see [Managing DCOS Services](http://docs.mesosphere.com/services/overview/).

 
Containerizer

: The term containerization is a general concept that can encompass such things as resource isolation and packaging.  The containerizer is the component in the Apache Mesos architecture which the slave invokes to containerize a task.


Executor

: The part of a Mesos framework that runs as a process launched on Mesos slaves to run the framework's tasks. 


Framework

: Software that runs on top of Mesos, and includes both a Scheduler and one or more Executors. Receives resource offers describing CPU, RAM, etc., and allocates them for discrete tasks that can be launched on Mesos-slaves.  An example of a framework is Marathon. 


Master

: A Mesos master aggregates resource offers from all the slaves (worker nodes) and provides them to registered frameworks. For more details about the Mesos master, read about  <a href="http://open.mesosphere.com/reference/mesos-master/" target="_blank">Mesos Master Configuration</a>.

Mesosphere repository

: The public repository is maintained by Mesosphere and includes datacenter services supported by Mesosphere. The Mesosphere repository stores certified versions of DCOS services.


Offer

: An offer represents available resources (e.g. cpu, disk, memory) which a slave offers to the master and the master hands to the registered frameworks in some order. 

Scheduler

: The part of a Mesos framework responsible for the deployment scheduling policies and resource assignment of tasks.

Slave

: A Mesos slave runs a discrete Mesos task on behalf of a framework. It is a worker instance registered with the Mesos master. The synonym of slave is worker node.


Task

:  A unit of work, scheduled by a framework and executed on a Mesos slave. In Hadoop terminology, this is a "job". In MySQL terminology, this is a "query" or "statement". A task may simply be a Bash command or a Python script. 


Working directory

: A Mesos master requires a directory on the local file system to write replica logs to. 

Worker node

: A Mesos worker node runs a discrete Mesos task on behalf of a framework. It is a worker instance registered with the Mesos master. The synonym of worker node is slave.
