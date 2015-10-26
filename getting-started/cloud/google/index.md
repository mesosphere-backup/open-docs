---
layout: doc
title: Mesosphere on Google Cloud Platform
---

Mesosphere is excited to be working with Google on a number of projects to provide the scale and fault tolerance of Mesos on top of Google's industry leading infrastructure as a service (IaaS) offering.

***
## Mesosphere and Kubernetes

Google and Mesosphere are leading the charge in the advancement of scaling container technologies through the [Kubernetes project](https://github.com/GoogleCloudPlatform/kubernetes) and the [Mesosphere DCOS](https://docs.mesosphere.com/services/kubernetes/). While this project is still under heavy development, it allows you to combine the easy pod and label abstraction of Kubernetes with the advanced scheduling features of Mesos.

***
## Deploying to Google Cloud Platform

There are three ways to use Mesosphere on top of Google Compute Engine which vary in ease of use and configurability.

### Mesosphere for Google Cloud Platform

[Mesosphere for Google Cloud Platform](https://google.mesosphere.com/) provides the fastest and simplest way to create a Mesosphere cluster on Google Cloud Platform.

This web application allows users to create anything from a simple, single master cluster to a fault tolerant and high-availability multi-master cluster through a simple wizard. The cluster is secured against external access and provides authorized access via OpenVPN.

Mesosphere for Google Cloud Platform currently deploys and configures:

* Apache Mesos with in-built Docker support
* Mesosphere Marathon
* Chronos
* Spark
* Apache ZooKeeper
* HAProxy
* OpenVPN
* HDFS

See our [Getting Started with Mesosphere for Google Cloud Platform](mesosphere) guide for more information.

### Do it Yourself

Instructions on installing Mesosphere manually can be found in our [Setting up a Mesosphere Cluster](/getting-started/datacenter/install) guide.
