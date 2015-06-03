---
layout: doc
title: Benefits of Mesosphere on IaaS
---

## Introduction

If your company is among the many that run services on an infrastructure as a service (IaaS) solution like [Amazon (AWS) EC2](http://aws.amazon.com/ec2),  [Google Cloud Platform](https://cloud.google.com), [DigitalOcean](https://www.digitalocean.com/) or your own virtualized datacenter, you may wonder if there is value in using [Mesosphere](/mesosphere).  The answer is a resounding **yes!**  While Mesosphere is capable of adding significant value on IaaS, on bare metal or a combination of those environments, this article outlines the value specific to running only on IaaS. We draw our insights from conversations with existing Apache Mesos users.


## Operational Benefits

### Move from Static Partitioning to Elastic Sharing

With Mesosphere, a cloud platform transforms from a collection of many nodes into a single pool of resources. This is a huge benefit. Developers can focus on managing their applications and services instead of worrying about individual nodes of the cluster. Multiple applications can run side-by-side on the same nodes, maximizing resource utilization and allowing applications to elastically scale with demand. Mesosphere ensures strong workload isolation and orchestrates the placement of applications across the cluster.

### Increase Reliability

A common way to provide reliability in a cloud environment is to provision more instances of a service than is needed, so when a number of instances fail, enough services survive to cover the loss. Mesosphere monitors application instances and automatically migrates them when nodes fail, providing fault tolerance and reliability on a smaller cluster size.

### Better Resource Utilization

In a statically partitioned cloud, each node is given a single purpose. The size and number of nodes for a given application is determined by its peak load. Because of this, the average CPU utilization can be [as low as 7%](https://gigaom.com/2013/11/30/the-sorry-state-of-server-utilization-and-the-impending-post-hypervisor-era/), even in the cloud. Mesosphere provides resource constraints and isolation at a container level, and bin-packs a number of applications onto a single node to maximize utilization of CPU and memory.

<img src="{% asset_path mesos-elastic.jpg %}" alt="" width="60%">

### Reduces Complexity

Amazon's whitepaper for ["Building Fault-Tolerant Applications in the AWS Cloud"](http://aws.amazon.com/whitepapers/designing-fault-tolerant-applications/) recommends building an [Amazon Machine Images (AMI)](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html) for each application a user wants to run. Every change to an application requires rebuilding its image, creating significant operational complexity. With Mesosphere, only one base image is required for the entire cluster. Mesosphere manages the deployment of application code on top of the base image.

### Reduces Cost

Each virtual machine runs an entire operating system which consumes resources. Because Mesosphere provides isolation through container technology instead of VMs, fewer VMs are needed, reducing waste. Increased resource utilization through bin-packing and elastic sharing of resources leads to a significant reduction in monthly cloud spend.

[Gigaom reports](https://gigaom.com/2014/05/31/automation-is-the-key-to-saving-cash-in-the-cloud-but-how-to-do-it/) that when Hubspot moved to Mesos, they managed to cut their Amazon Web Services bill in half.

### Scaling Ease

Mesosphere allows organizations to look at two different levels of scaling.  There is scaling an application according to demand, within the existing capacity of the cluster, and scaling the capacity of the cluster as a whole.

Different types of workloads have different resource requirements throughout the day. For example web traffic typically peaks around noon, whereas heavy analytics jobs are often run at night. Mesosphere allows operators to scale back resources for web traffic during off-peak hours to free them up for analytics jobs. This allows these workloads to take over a larger part of the cluster, and enables new use cases while speeding up existing jobs.

Growing or shrinking the total size of your Mesosphere cluster is as easy as adding or removing nodes. New nodes join the cluster, and workloads are immediately scheduled onto them. Moving to a different node size simply means replacing existing nodes one by one, while the cluster keeps running.

### Cloud Agnostic

A significant advantage of Mesosphere is the fact that it is cloud and datacenter agnostic, which means that your applications can be too.  If you decide to move to a new cloud or datacenter, just setup a Mesosphere cluster to deploy and manage your application as you always have. The underlying machines are just a set of resources to Mesosphere. There is no cloud lock in.

## Developer Benefits

### Unified Deployment Process

Mesosphere provides a unified deployment platform for any application stack, like Rails, Node, Tomcat, Django, etc. Developers get direct access to the cluster, and can deploy applications through a centralized dashboard or REST API to cluster nodes that have resources available.

### Better Performance

In a multi-tenant virtualized environment, VM instances may be co-located with busy VMs from other tenants, leading to degraded performance. This is known as the noisy neighbor problem. Through Mesosphere's bin-packing, developers can chose larger VM types (or entire physical nodes, if available), reducing the effects or avoiding the problem altogether.

### Reduce Time to Market

By giving developers direct access to cluster resources, and automating infrastructure concerns like deployment and fault tolerance, Mesosphere significantly reduces time to market for new apps.
