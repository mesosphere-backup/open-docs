---
layout: doc
title: Automating Cluster Provisioning
---

## Introduction

There are number of automation tools which can be used to automate installation of Mesosphere in the datacenter. Popular projects are listed below.

### Chef

[Chef](http://www.getchef.com/chef/) is a popular recipe based infrastructure automation tool.  [mesos-cookbook](https://github.com/mdsol/mesos_cookbook) provides an extensive cookbook that is open source.  It includes recipes for Apache Mesos, Docker support for Mesos, Mesosphere Marathon and Chronos.

### Puppet

[Puppet](http://puppetlabs.com/) is a popular model based infrastructure automation tool.  The [puppet-mesos](https://github.com/deric/puppet-mesos) project is available in [Puppet Forge](https://forge.puppetlabs.com/deric/mesos).

### Ansible

[Ansible](http://www.ansible.com/home) is growing in popularity as an infrastructure automation tool. Ansible is handy because nodes are managed  over ssh and it requires no additional software installed except Python. There are a number of Ansible playbooks to highlight.

The [AnsibleShipyard](https://github.com/AnsibleShipyard) is a great place to get started.  It contains a number of playbooks for Mesosphere components including:

* [ansible-mesos](https://github.com/AnsibleShipyard/ansible-mesos)
* [ansible-marathon](https://github.com/AnsibleShipyard/ansible-marathon)

* [ansible-chronos](https://github.com/AnsibleShipyard/ansible-chronos)
A more complete Ansible playbook for the full Mesosphere can be found at Michael Hamrah's [ansible-mesos-playbook](https://github.com/mhamrah/ansible-mesos-playbook).  He [describes on his blog](http://blog.michaelhamrah.com/2014/06/setting-up-a-multi-node-mesos-cluster-running-docker-haproxy-and-marathon-with-ansible/) how to use this playbook to set up a cluster on EC2.
