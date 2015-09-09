---
layout: doc
title: Exercise 20 – Advanced Cluster Building
---

This final exercise teaches you how to use your Ansible configuration
to craft Virtualbox templates that you can use to build more nodes in the cluster.
This is to simulate how to combine Ansible with VM templates to get more
repeatable builds for your node.

In this exercise:

1. Use Ansible, Chef, or Puppet to craft nodes locally.
2. Save them to a template file once they work well and you need to deploy.
3. Use that template to then seed your cluster quicker and more reliably to get base node configuration.
4. Let Marathon get the rest of your infrastructure running using Docker applications.

Video Lecture
-------------

Video lecture pending for this exercise.


Quick Reference
---------------

Run the new ``nodes`` configuration for your slave nodes that disables a few more things and gets the ready for this first phase:

```
- hosts: nodes
  remote_user: vagrant
  sudo: yes
  tasks:
      - name: update the hosts file
        template: src=./hosts.j2 dest=/etc/hosts
      - name: install the mesosphere yum repo
        shell: rpm -Uvh http://repos.mesosphere.com/el/7/noarch/RPMS/mesosphere-el-repo-7-1.noarch.rpm
      - name: install the mesos and docker packages
        yum: pkg=device-mapper-event-libs,mesos,docker state=latest
      - name: configure containerizers
        shell: echo 'docker,mesos' | sudo tee /etc/mesos-slave/containerizers
      - name: set the zookeeper master
        shell: sed -i -e 's/localhost/192.168.33.10/g' /etc/mesos/zk
      - name: stop the mesos slave but make it start on book
        service: name=mesos-slave state=stopped enabled=yes
      - name: disable the mesos-master by default
        service: name=mesos-master state=stopped enabled=no
      - name: kill the slave state
        shell: rm -rf /tmp/mesos*
      - name: start docker
        service: name=docker state=started enabled=yes
      - name: install outyet
        shell: sudo docker load --input=/vagrant/outyet.tar.gz
```

This is effectively adding cleaning out some ``mesos-slave`` state before the server starts, but later we'll do this again to ``node2`` to get it ready for saving.

Run ``vagrant destroy``:

```
$ vagrant destroy -f && vagrant up node1 node2
```

To confirm that your ``playbook.yml`` works and can build the master and the first slave.  Once it comes up, node2 should not have ``mesos-slave`` running and there's nothing in ``/tmp`` because you cleared the state in the ``playbook.yml``.  Next you halt ``node2`` so you can package it:

```
$ vagrant halt node2
```

Save the ``node2`` Vagrant box to a new ``mesos-slave`` box:

```
$ rm -f package.box
$ vagrant package node2
$ vagrant box add mesos-slave package.box
```

Destroy the ``node3`` and ``node4`` to get them ready to build based on the new configuration:

```
$ vagrant destroy -f node3 node4
```

You have to do this before changing the ``Vagrantfile`` or else Vagrant can't find them.

Change the configuration for ``node3`` and ``node4`` to:

```
    config.vm.define "node3" do |node3|
        node3.vm.network "private_network", ip: "192.168.33.12"
        node3.vm.hostname = "node3"
        node3.vm.box = "mesos-slave"
        config.vm.provision "shell", inline: "sudo cp /vagrant/hosts.j2 /etc/hosts"
    end

    config.vm.define "node4" do |node4|
        node4.vm.network "private_network", ip: "192.168.33.13"
        node4.vm.hostname = "node4"
        node4.vm.box = "mesos-slave"
        config.vm.provision "shell", inline: "sudo cp /vagrant/hosts.j2 /etc/hosts"
    end
```

Run ``vagrant up`` to build using the node template rather than with Ansible.  After that all the nodes should be ready, but in a default clean state.  Simply restart them and they'll fire up as new slave nodes:

```
$ vagrant up node3 node4
$ vagrant halt node2 node3 node4
$ vagrant up    
```

Once that works you should see the new slave nodes and also see your Marathon configuration start deploying the apps to them. If you ``vagrant up`` and they still aren't recognized by Mesos as slaves then check the following:

1. Is ``/etc/hosts`` configured correctly on all nodes?
2. Are ``mesos-slave`` processes running on all nodes?
3. Did you wait a little while?  Sometimes Mesos takes a little time to recognize new nodes, but not longer than 10 minutes.
4. Did you configure ``docker,mesos`` in the ``/etc/mesos-slave/containerizers`` file?  The ``playbook.yml`` should do this but go confirm that's configured.
5. If all else fails, shut down the nodes and start them again.
6. If that all fails then look at the ``/etc/mesos/`` logs and see if there's any cluse, then contact us in the comments for help.

Final Configuration
-------------------

Your final Ansible ``playbook.yml`` is now this:

```
---
- hosts: master
  remote_user: vagrant
  sudo: yes
  tasks:
      - name: update the hosts file
        template: src=./hosts.j2 dest=/etc/hosts
      - name: update the rsyslog config
        template: src=./mesos.conf.j2 dest=/etc/rsyslog.d/mesos.conf
      - name: restart rsyslog
        shell: service rsyslog restart
      - name: install the mesosphere yum repo
        shell: rpm -Uvh http://repos.mesosphere.com/el/7/noarch/RPMS/mesosphere-el-repo-7-1.noarch.rpm
      - name: install zookeeper repo
        shell: rpm -Uvh http://archive.cloudera.com/cdh4/one-click-install/redhat/6/x86_64/cloudera-cdh-4-0.x86_64.rpm
      - name: install zookeeper
        yum: pkg=zookeeper,zookeeper-server state=latest
      - name: configure zookeeper ID
        shell: sudo -u zookeeper zookeeper-server-initialize --myid=1
      - name: install the mesos, marathon, chronos, docker packages
        yum: pkg=device-mapper-event-libs,mesos,marathon,chronos,docker state=latest
      - name: configure containerizers
        shell: echo 'docker,mesos' | sudo tee /etc/mesos-slave/containerizers
      - name: start up zookeeper
        service: name=zookeeper-server state=started enabled=yes
      - name: start up the mesos-master
        service: name=mesos-master state=started enabled=yes
      - name: make sure mesos-slave is running
        service: name=mesos-slave state=started enabled=yes
      - name: start marathon
        service: name=marathon state=started enabled=yes
      - name: start chronos
        service: name=chronos state=started enabled=yes
      - name: start docker
        service: name=docker state=started enabled=yes
      - name: install go and dns tools
        yum: pkg=golang,git,bind-utils state=latest
      - name: build mesos-dns
        shell: sudo -u vagrant sh /vagrant/installdns.sh
      - name: install outyet
        shell: sudo docker load --input=/vagrant/outyet.tar.gz
      - name: start marathon services
        shell: cd /vagrant/marathon && sh post.sh
      - name: install ruby
        yum: pkg=ruby state=latest
      - name: sync chronos jobs
        shell: ruby /vagrant/chronos-sync.rb -u http://192.168.33.10:4400/ -p /vagrant/chronos
- hosts: nodes
  remote_user: vagrant
  sudo: yes
  tasks:
      - name: update the hosts file
        template: src=./hosts.j2 dest=/etc/hosts
      - name: install the mesosphere yum repo
        shell: rpm -Uvh http://repos.mesosphere.com/el/7/noarch/RPMS/mesosphere-el-repo-7-1.noarch.rpm
      - name: install the mesos and docker packages
        yum: pkg=device-mapper-event-libs,mesos,docker state=latest
      - name: configure containerizers
        shell: echo 'docker,mesos' | sudo tee /etc/mesos-slave/containerizers
      - name: set the zookeeper master
        shell: sed -i -e 's/localhost/192.168.33.10/g' /etc/mesos/zk
      - name: stop the mesos slave but make it start on book
        service: name=mesos-slave state=stopped enabled=yes
      - name: disable the mesos-master by default
        service: name=mesos-master state=stopped enabled=no
      - name: kill the slave state
        shell: rm -rf /tmp/mesos*
      - name: start docker
        service: name=docker state=started enabled=yes
      - name: install outyet
        shell: sudo docker load --input=/vagrant/outyet.tar.gz
```

And your final ``Vagrantfile`` is this:

```
# -*- mode: ruby -*-
# vi: set ft=ruby :

ANSIBLE_GROUPS = {
              "master" => ["node1"],
              "nodes" => ["node2"],
              "all_groups:children" => ["master", "nodes"]
            }


Vagrant.configure(2) do |config|
    config.vm.box = "chef/centos-7.0"

    config.vm.define "node1" do |node1|
        node1.vm.network "private_network", ip: "192.168.33.10"
        node1.vm.hostname = "node1"
        #node1.vm.box = "mesos-master"
        node1.vm.provision "ansible" do |ansible|
            ansible.playbook = "playbook.yml"
            ansible.groups = ANSIBLE_GROUPS
        end
    end

    config.vm.define "node2" do |node2|
        node2.vm.network "private_network", ip: "192.168.33.11"
        node2.vm.hostname = "node2"
        node2.vm.provision "ansible" do |ansible|
            ansible.playbook = "playbook.yml"
            ansible.groups = ANSIBLE_GROUPS
        end
    end
    config.vm.define "node3" do |node3|
        node3.vm.network "private_network", ip: "192.168.33.12"
        node3.vm.hostname = "node3"
        node3.vm.box = "mesos-slave"
        config.vm.provision "shell", inline: "sudo cp /vagrant/hosts.j2 /etc/hosts"
    end

    config.vm.define "node4" do |node4|
        node4.vm.network "private_network", ip: "192.168.33.13"
        node4.vm.hostname = "node4"
        node4.vm.box = "mesos-slave"
        config.vm.provision "shell", inline: "sudo cp /vagrant/hosts.j2 /etc/hosts"
    end
end
```

With these two files, and the ``marathon`` and ``chronos`` configuration directories, you are now able to build a full Mesos cluster repeatably and you should be able to
move this similar build to your own cluster.

Further Study
-------------

This is the end of the first course.  More to come as we receive feedback on it and will have some further study then.

