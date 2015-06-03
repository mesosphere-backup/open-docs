---
layout: doc
title: Mesosphere in Production
---

## Introduction

Mesosphere is intended to manage a cluster of nodes; in the cloud or in your datacenter.  A large scale production datacenter has thousands of nodes and requires automation in order to maintain it.  There are a number of great automation tools value to manage Mesosphere clusters, listed on [Automating Cluster Provisioning](/getting-started/datacenter/automation).  This document provides a guide and our philosophy around datacenter installation and configuration of Mesosphere.

## The Mesosphere Datacenter Philosophy

We, at Mesosphere, understand that containerization technology coupled with efficient resource management changes how the datacenter is partitioned, how applications are managed and what is installed on cluster nodes. This new approach has many benefits, from better resource utilization to enforced isolation. However, it also means that how nodes are provisioned is now different. Our philosophy on how a datacenter should be run includes:

* Elastic partitioning
* Homogeneous nodes
* Mesosphere at the core
* Services encapsulated in containers
* Inherent fault-tolerance and high-availability

### Elastic partitioning

Historically datacenters have been statically partitioned such that nodes are provisioned for specific services. This requires manual effort to scale and results in brittle clusters. Using Apache Mesos, Mesosphere clusters are able to elastically partition the cluster, treating each node as part of a larger pool of resources. It then becomes trivial for the operator to adjust partitions on the fly.

### Homogeneous nodes

Homogeneous nodes are the enabler of elastic partitioning. The idea is that all the compute nodes are exactly the same.  They have the same image or recipe associated with them. Instead of having a recipe for a number of specific applications, there is one for the Mesosphere Slave. When using Mesosphere, you only require two recipes for nodes: masters and slaves.

### Mesosphere at the core

It is desirable to have Mesosphere installed on top of the operating system; on bare metal or in a virtual machine.   This allows frameworks direct access to non-container resources such as networking and reduces the latency of communication of the cluster.

### Services encapsulated in containers

The details of an application inside of a container are not the concern of administration and operations of the cluster.  It is common to see the configuration of an application in a container pulled out of legacy deployment scripts and into the build process.  This is another way in which code is reduced in the deployment model or recipe.

### Inherent fault-tolerance and high-availability

High availability configuration of a cluster normally requires significant extra configuration. However, Mesosphere makes this easy, having being built from the beginning for high-availability and fault-tolerance. High availability for Mesosphere clusters requires at least three ZooKeepers, three Mesos masters and three Marathon instances.  The [Apache Mesos documentation](http://mesos.apache.org/documentation/latest/high-availability/) has more details on configuring high availability setups, while [Setting up a Mesosphere Cluster](/getting-started/datacenter/install) details how to set up your own high availability cluster.

