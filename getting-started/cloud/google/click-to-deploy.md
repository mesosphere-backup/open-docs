---
layout: doc
title: Mesosphere - Google Click-to-Deploy
---

## Google Cloud Platform Click-to-Deploy

[Mesosphere Click-to-deploy on Google Compute Engine](https://developers.google.com/cloud/mesos) is hosted directly from the Google Compute Engine web console and provides the ability to to create a Mesosphere cluster.  It will provision:

* Apache Mesos
* Apache ZooKeeper
* Mesosphere Marathon

Provisioning Mesosphere this way allows you the convenience of deploying directly from the Google Compute Engine, however it does not provide the convenience of provisioning a secure connection to your cluster from your laptop nor does it provide you with the convenience of using the Mesosphere launch console.

***
## How do I Manage the Mesosphere Cluster?

If you are looking for the most control over your cluster checkout [Mesosphere for Google Cloud Platform](/getting-started/cloud/google/mesosphere).  Management of a click-to-deploy Mesosphere cluster is still possible through the Marathon web UI (port: 8080) and the Mesos web UI (port: 5050).   Access to those ports will be from the the Master nodes.

***
## Limits of Click-To-Deploy

The only limit of the click-to-deploy Mesosphere cluster relative to the Mesosphere for Google Cloud Platform is the provision of OpenVPN with Google Compute.  Mesosphere for Google Cloud Platform auto provisions VPN so you are able to jump right to the adminstrative web consoles; Marathon (port: 8080) and Mesos (port: 5050).
