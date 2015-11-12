---
layout: doc
title: Getting Started with Mesosphere for Google Cloud Platform
---

## Introduction
Welcome to Mesosphere for Google Cloud Platform!  [Mesosphere for Google Cloud Platform](http://google.mesosphere.com) is the fastest way to deploy [Mesosphere](/mesosphere/) into the cloud.  It does this on top of Google's [Compute Engine](https://cloud.google.com/products/compute-engine/).  Mesosphere provides a wizard to step you through the creation of a Mesosphere cluster.  There are three required activities outside of the wizard.  This document provides some helpful information to the process of provisioning a cluster.

***
## Launching Mesosphere for Google Cloud Platform
It is necessary to have a Google account prior to using Mesosphere for Google Cloud Platform.  To have the smoothest experience, you should have a Google Compute account with a project set up with **billing**.  You can verify you have a Google Compute account by accessing the [developers console](https://console.developers.google.com).  When signed in you will see a list of projects. You will need to have a project which is set up as a [billable project](#billing).

There are just 8 steps to launch a Mesosphere cluster with Mesosphere for Google Cloud Platform, a few of which require you to provide some external information. These are detailed below.

1. Sign into Mesosphere for Google Cloud Platform with your Google account.
1. We authenticate your credentials with Google to get access to your Google Compute account.
1. Choose a [cluster type](#cluster-type) (Development, Highly Available or Custom).
1. Provide Mesosphere with a [ssh public key](#ssh-key) to allow you terminal access to the created instances.
1. Specify a [Google Compute project ID](#project-id) set up with [billing](#billing).
1. Launch your cluster!
1. Personalize your cluster.
1. [Configure VPN](#vpn-setup) once provisioning has finished to allow secure access to your cluster.

<div class="alert alert-info">
<strong>Note:</strong>
The time to launch will vary based on the cluster configuration chosen and will likely take at least five minutes.
</div>

<a name="launchpad"></a>
***
## Mesosphere Launchpad
Once you have provisioned one or more clusters, the [Mesosphere Launchpad](https://google.mesosphere.com) is where you can manage previously provisioned clusters. From the Launchpad it is possible to:

* Manage Mesos through the Mesos web console.
* Manage running applications through the [Marathon](https://mesosphere.github.io/marathon/docs/) web console.
* Manage ssh public keys.
* Teardown (or destroy) running clusters.
* Access Mesosphere documentation

***
## Provisioning a Cluster

<a name="cluster-type"></a>
### Choose a cluster type
There are two primary factors that affect selection of cluster type:

* cost
* fault tolerance & availability

#### Development Cluster
A development cluster provides a low cost option to evaluate and test but doesn't provide high availability capabilities.

#### Highly-Available Cluster
A highly-available cluster is a higher cost and configures installed applications in high availability mode where available. It accomplishes this with three Mesos masters, as well as a greater number of slave nodes.

#### Custom Cluster

This option gives Mesos ninjas full control of the cluster configuration through Mesosphere for Google Cloud Platform, including number of masters, number of slaves, region, instance type and more.

<a name="ssh-key"></a>
### Provide an ssh public key
Mesosphere for Google Cloud Platform requires an ssh public key from the user. This is necessary to set up ssh access to provisioned cluster instances for the user. If you don't have an existing ssh public key, see the [ssh key generation documentation](/mesosphere/administration/generate-ssh-key) for more information.

<a name="project-id"></a>
### Specify a Google Compute project ID

In order to provision a cluster, Mesosphere for Google Cloud Platform needs to know the project ID of the Google Compute project you would like to use. Your Google Compute projects are listed at [https://console.developers.google.com/project](https://console.developers.google.com/project) and the ID can be found in the second column.

The illustration below shows a project named "mesos-vpn" with a project ID of `mesos-vpn`.  This is the value that must be provided to Mesosphere for Google Cloud Platform in step 7 of the wizard.

`<img src="{% asset_path google-project-id.png %}" alt="" width="600">

<a name="billing"></a>
### Ensure the project has billing
In order to provision instances, your Google Compute project must have billing set up. [Google's documentation](https://developers.google.com/console/help/new/#billing) details how to set up billing for a new project.

<a name="vpn-setup"></a>
### Configure VPN
Once Mesosphere for Google Cloud Platform has successfully provisioned your cluster, it is necessary to install and configure OpenVPN. This allows secure access to your Mesosphere cluster and requires the installation of a local client and configuration using VPN credentials provided in the Launchpad.

***
## SSHing into a Cluster

Mesosphere for Google Cloud Platform uses the public RSA key you provide at cluster launch to provision Google Compute Engine instances configured for SSH access by you. This section covers some of the nuances associated with SSH access to these servers.

### SSH User

It is important when accessing a server via SSH to specify a user.  When a user isn't specified, SSH will assume the current user.  The user provisioned for your access on your Mesosphere cluster is `jclouds` due to a limitation in the [Apache jclouds](https://jclouds.apache.org/) library which Mesosphere uses to provision instances.

### Instructions

Assuming you have a running cluster, visit your [list of clusters](https://google.mesosphere.io/clusters).  Select the cluster you wish to access to see more details.  At the bottom of the page is a section titled "Topology".

<img src="{% asset_path gce-topology.png %}" alt="" width="100%">

In this example, there is one master with an external IP of `107.178.217.143` and internal IP of `10.144.122.3`.

Connection to the external IP can be established executing `ssh jclouds@107.178.217.143`

<div class="alert alert-info">
<strong>Note:</strong>
	You are the only one who has SSH access into these servers.  Access requires the matching private key to the public key provided at the time of provisioning.
</div>


#### Connecting to an Internal IP

One of the benefits of using Mesosphere for Google Cloud Platform is that it [installs and configures OpenVPN](/getting-started/cloud/setting-up-mesosphere-vpn/) with your cluster.

This allows you to also connect directly to the internal IP address of each instance in your cluster.

In order to connect via SSH to the master internal IP in this example execute the command `ssh jclouds@10.144.122.3`.

