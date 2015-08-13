---
layout: doc
title: Getting Started with Mesosphere for DigitalOcean

redirect_to: http://docs.mesosphere.com/
---

## Introduction
Welcome to Mesosphere for DigitalOcean!  [Mesosphere for DigitalOcean](http://digitalocean.mesosphere.com) is the fastest way to deploy [Mesosphere](/mesosphere/) into the cloud.  Mesosphere provides a wizard to step you through the creation of a Mesosphere cluster.  There are three required activities outside of the wizard.  This document provides some helpful information to the process of provisioning a cluster.

***
## Launching Mesosphere for DigitalOcean
It is necessary to have a DigitalOcean account prior to using Mesosphere for DigitalOcean.  To have the smoothest experience, you should have a DigitalOcean account with **billing**.  You can verify you have a DigitalOcean account by accessing the [developers console](https://cloud.digitalocean.com).  You will need to [configure billing](https://cloud.digitalocean.com/billing).

There are just 6 steps to launch a Mesosphere cluster with Mesosphere for DigitalOcean, a few of which require you to provide some external information. These are detailed below.

1. Sign into Mesosphere for DigitalOcean with your DigitalOcean account.
1. Choose a [cluster type](#cluster-type) (Development, Highly Available or Custom).
1. Provide Mesosphere with a [ssh public key](#ssh-key) to allow you terminal access to the created instances.
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
Once you have provisioned one or more clusters, the [Mesosphere Launchpad](https://digitalocean.mesosphere.com) is where you can manage previously provisioned clusters. From the Launchpad it is possible to:

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

This option gives Mesos ninjas full control of the cluster configuration through Mesosphere for DigitalOcean, including number of masters, number of slaves, region, instance type and more.

<a name="ssh-key"></a>
### Provide an ssh public key
Mesosphere for DigitalOcean requires an ssh public key from the user. This is necessary to set up ssh access to provisioned cluster instances for the user. If you don't have an existing ssh public key, see the [ssh key generation documentation](/reference/generate-ssh-key) for more information.

<a name="billing"></a>
### Ensure the project has billing
In order to provision instances, your DigitalOcean account must have billing set up. Go to the [DigitalOcean console](https://cloud.digitalocean.com/billing) to configure that.

<a name="vpn-setup"></a>
### Configure VPN
Once Mesosphere for DigitalOcean has successfully provisioned your cluster, it is necessary to install and configure OpenVPN. This allows secure access to your Mesosphere cluster and requires the installation of a local client and configuration using VPN credentials provided in the Launchpad.  Full details of how to configure OpenVPN for your cluster are outlined on [this page](/getting-started/cloud/setting-up-mesosphere-vpn).

***
## SSHing into a Cluster

Mesosphere for DigitalOcean uses the public RSA key you provide at cluster launch to provision DigitalOcean instances configured for SSH access by you. This section covers some of the nuances associated with SSH access to these servers.

### SSH User

It is important when accessing a server via SSH to specify a user.  When a user isn't specified, SSH will assume the current user.  The user provisioned for your access on your Mesosphere cluster is always `root`.

### Instructions

Assuming you have a running cluster, visit your [list of clusters](https://digitalocean.mesosphere.io/clusters).  Select the cluster you wish to access to see more details.  At the bottom of the page is a section titled "Topology".

<img src="{% asset_path do-topology.png %}" alt="" width="100%">

In this example, there is one master with an external IP of `104.131.76.235` and internal IP of `10.132.195.126`.

Connection to the external IP can be established executing `ssh root@104.131.76.235`

<div class="alert alert-info">
<strong>Note:</strong>
	You are the only one who has SSH access into these servers.  Access requires the matching private key to the public key provided at the time of provisioning.
</div>


#### Connecting to an Internal IP

One of the benefits of using Mesosphere for Digital Ocean is that it [installs and configures OpenVPN](/getting-started/cloud/setting-up-mesosphere-vpn/) with your cluster.

This allows you to also connect directly to the internal IP address of each instance in your cluster.

In order to connect via SSH to the master internal IP in this example execute the command `ssh root@10.132.195.126`.

