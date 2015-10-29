---
layout: doc
title: Provisioning Tools for Mesos
redirect_from: /getting-started/datacenter/automation/
---


## Introduction

There are number of automation tools which can be used to automate installation of Mesosphere in the datacenter. Popular projects are listed below.

## Chef

[Chef](http://www.getchef.com/chef/) is a popular recipe based infrastructure automation tool.

### [Mesos Chef Cookbook by Everpeace](https://github.com/everpeace/cookbook-mesos)

Install Mesos and configure master and slave. This cookbook supports installation from source or the Mesosphere packages.

### [Mesos Chef Cookbook by Mdso](https://github.com/mdsol/mesos_cookbook)

Application cookbook for installing the Apache Mesos cluster manager. It includes recipes for Apache Mesos, Docker support for Mesos, Marathon and Chronos.

## Puppet

[Puppet](http://puppetlabs.com/) is a popular model based infrastructure automation tool.  The [puppet-mesos](https://github.com/deric/puppet-mesos) project is available in [Puppet Forge](https://forge.puppetlabs.com/deric/mesos).

### [Puppet Module by Deric](https://github.com/deric/puppet-mesos)

This is a Puppet module for managing Mesos nodes in a cluster.

## Ansible

[Ansible](http://www.ansible.com/home) is growing in popularity as an infrastructure automation tool. Ansible is handy because nodes are managed  over ssh and it requires no additional software installed except Python. There are a number of Ansible playbooks to highlight.

### [Ansible Mesos Playbook](https://github.com/AnsibleShipyard/ansible-mesos)

Spin up a Mesos cluster with Ansible.

### [Ansible Chronos Playbook](https://github.com/AnsibleShipyard/ansible-chronos)

Configure Chronos with Ansible.

### [Ansible Marathon Playbook](https://github.com/AnsibleShipyard/ansible-marathon)

Configure Marathon with Ansible.

### [Ansible Mesos Playbook](https://github.com/mhamrah/ansible-mesos-playbook)

Michael Hamrah provides a more complete Ansible playbook for a Mesos + Marathon + Chronos stack. He [describes on his blog](http://blog.michaelhamrah.com/2014/06/setting-up-a-multi-node-mesos-cluster-running-docker-haproxy-and-marathon-with-ansible/) how to use this playbook to set up a cluster on EC2.

## [Mesos Framework giter8 Template](https://github.com/mesosphere/scala-sbt-mesos-framework.g8)

This is a giter8 template. The result of applying this template is a bare-bones Apache Mesos framework in Scala using SBT for builds and Vagrant for testing on a singleton cluster.

## [Vagrant (Virtualbox, AWS, DigitalOcean)](https://github.com/tayzlor/vagrant-puppet-mesosphere)

Configure a Mesosphere cluster which includes Apache Mesos, Marathon and Consul against Virtualbox, Amazon Web Services or DigitalOcean.