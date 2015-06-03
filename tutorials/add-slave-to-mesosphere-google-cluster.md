---
layout: doc
title: Adding a Slave to a Mesosphere Cluster on Google Cloud Platform
redirect_from:
  - /learn/add-slave-to-mesosphere-google-cluster/
---

Mesosphere for Google Cloud Platform is a great way to automate the provisioning of a Mesosphere cluster on Google Compute Engine.  The current version of this great product doesn't allow automatic addition of a slave to the cluster.   While this feature will likely be in a future version, many users want this ability right now.

This tutorial walks through the steps necessary on [Google Compute Engine](https://console.developers.google.com/project) to establish another slave for a Mesosphere cluster.  In this tutorial we add a slave to a "Development Cluster" provisioned using [Mesosphere for Google Compute Platform](https://google.mesosphere.io), which, by default, has three slaves.

***

## Prerequisites

* Cluster created using [Mesosphere on Google Cloud Platform](https://google.mesosphere.io)
* [VPN connection to the cluster](/getting-started/cloud/setting-up-mesosphere-vpn)

Once you have a cluster created and are connected to its VPN, navigate to the [Mesosphere Launchpad](https://google.mesosphere.io/clusters) for cluster details.  From the Launchpad, select the cluster of interest and scroll to the topology section at the bottom.

<img src="{% asset_path learn/mesosphere-launchpad.png %}" alt="" width="60%">

We need the following information to begin with:

* name of a slave, e.g. `development-300-1ac`
* location of a slave, e.g. `us-central1-a`

The Mesos console will allow you to validate the number of active slaves. Open the console via the Mesos button in the Consoles section.  In the web console you can confirm that there are only 3 slaves next to **Activated**.

<img src="{% asset_path learn/mesos-console.png %}" alt="" width="60%">

***

## Your Google Compute Project

The starting point for this tutorial is the Google Compute Engine console at [https://console.developers.google.com/project](https://console.developers.google.com/project).  From the console, select the project which you used to provision the Mesosphere for Google Cloud Platform cluster.

***

## Create a Slave Snapshot

Navigate to Compute -> Compute Engine -> Snapshots in the left hand side menu.  Select the blue **New snapshot** button at the top.  Provide a name and the source disk of an existing slave instance, then click **Create**.  In this example, the snapshot name is `slave-snapshot`.

<img src="{% asset_path learn/gce-new-snapshot.png %}" alt="" width="60%">

***

## Create a Slave VM Instance

Navigate to Compute -> Compute Engine -> VM instances in the left hand side menu. We need the network name for an existing Mesosphere cluster instance, this can be found in the "Network" column in the list of instances. In this example, it is `mesosphere-development-330`

<img src="{% asset_path learn/gce-vm-instances.png %}" alt="" width="60%">

Select the blue **New instance** button at the top of this page and fill out the following information:

* instance name:  `development-330-slave1` (this can be anything but it is advisable to give it a name similar to your other cluster instances)
* zone: `us-central1-a` (select the same zone as the rest of your cluster)
* machine time: `n2-standard-2` (this is the standard size of Mesosphere for Google Cloud Platform instances)
* boot source: `New disk from snapshot`
* snapshot: `slave-snapshot`
* network:  `mesosphere-development-330` (select the appropriate network we looked up earlier)

<img src="{% asset_path learn/gce-new-slave.png %}" alt="" width="60%">

Select the blue **Create** button at the bottom and that's it!

### Mesosphere Cluster Management from the Launchpad

A VM instance created this way will not show under the cluster details from the Mesosphere Launchpad.

However, by setting two key value pairs in the instance's metadata, you can ensure this instance is deleted with all the other nodes in the cluster. This can be done at any point through the **Custom metadata** section of the instance details page accessed when you click on the instance name.   The key / value pairs are:

* jclouds-group:  `development-330` (where development-330 is the ID of your cluster)
* jclouds-delete-boot-disk:  `true`

***

## Verifying and Summary

After the instance is created and running, the Mesos console should now show that there are 4 **Activated** slaves.  This new slave is a copy of the slave from which you built the snapshot, and will be configured identically.

Provide feedback or questions to [support@mesosphere.io](mailto:support@mesosphere.io).

