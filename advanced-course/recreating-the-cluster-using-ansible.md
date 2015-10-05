---
layout: doc
title: Exercise 16 – Recreating the Cluster Using Ansible

redirect_from:
- /intro-course/ex16.html
---

You have a miniature Mesosphere cluster running on your computer, but what would happen if you had to destroy it and start over?  Luckily we have the [Ansible](http://www.ansible.com/home) tool where you can run one command to recreate your entire little cluster.

This exercise shows you how to create an Ansible playbook that can recreate the entire cluster that you manually created for the last 15 exercises.  You could have started with this, but then you wouldn't have known all the core concepts of Meso, Marathon, Chronos, and would be lost when you run into trouble.

In this exercise:

1. Create a simple ``playbook.yml`` file to get the master node working.
2. Change the ``Vagrantfile`` to run Ansible and your playbook when provisioning.
3. Augment the ``playbook.yml`` and ``Vagrantfile`` to provision nodes 2-4.
4. Destroy everything and confirm you can rebuild everything with one command.

Video Lecture
-------------

{% mesos_video Mesos-Intro-Course-16 %}


Quick Reference
---------------

To begin this exercise you will run ``vagrant destroy`` to destroy the cluster you just built.  If you'd like to keep it around then feel free to make a  new directory for this exercise or backup the directory first.  Once you're ready, run the following command at the host to destroy the cluster:

```
$ vagrant destroy -f
```

Now we can recreate everything with Ansible to automate the whole operation.  Ansible uses a YAML file to control how to build any Vagrant nodes, and Vagrant knows about Ansible configurations.  To get started, create a simple ``playbook.yml`` file with this:

```
---
- hosts: master
  remote_user: vagrant
  become: yes
  become_method: sudo
  tasks:
      - name: update hosts file
        template: src=./hosts.j2 dest=/etc/hosts
      - name: install mesosphere yum repo
        yum: name=http://repos.mesosphere.com/el/7/noarch/RPMS/mesosphere-el-repo-7-1.noarch.rpm state=present
      - name: install zookeeper yum repo
        yum: name=http://archive.cloudera.com/cdh4/one-click-install/redhat/6/x86_64/cloudera-cdh-4-0.x86_64.rpm state=present
      - name: install zookeeper
        yum: pkg=zookeeper,zookeeper-server state=latest
      - name: configure zookeeper ID
        become_user: zookeeper
        shell: zookeeper-server-initialize --myid=1
      - name: install mesos, marathon, chronos, and docker packages
        yum: pkg=device-mapper-event-libs,mesos,marathon,chronos,docker state=latest
      - name: configure containerizers
        lineinfile: dest=/etc/mesos-slave/containerizers create=yes line="docker,mesos"
      - name: start zookeeper
        service: name=zookeeper-server state=started enabled=yes
      - name: start mesos-master
        service: name=mesos-master state=started enabled=yes
      - name: start mesos-slave
        service: name=mesos-slave state=started enabled=yes
      - name: start marathon
        service: name=marathon state=started enabled=yes
      - name: start chronos
        service: name=chronos state=started enabled=yes
      - name: start docker
        service: name=docker state=started enabled=yes
      - name: install go, git, and dnsutil packages
        yum: pkg=golang,git,bind-utils state=latest
      - name: build/configure mesos-dns
        become_user: vagrant
        shell: sh /vagrant/installdns.sh
      - name: configure dns
        template: src=./resolv.conf.j2 dest=/etc/resolv.conf
      - name: install outyet
        shell: docker load --input=/vagrant/outyet.tar.gz
```

This playbook uses a simple script to install Mesos DNS called ``installdns.sh``:

```
mkdir ~/go
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin
go get github.com/tools/godep
go get github.com/mesosphere/mesos-dns
cd $GOPATH/src/github.com/mesosphere/mesos-dns
godep go build .
cp /vagrant/config.json .
```

And make sure you create the following ``config.json`` file from Exercise 7:

```
{
  "zk": "zk://192.168.33.10:2181/mesos",
  "masters": ["192.168.33.10:5050"],
  "refreshSeconds": 60,
  "ttl": 60,
  "domain": "mesos",
  "ns": "ns1",
  "port": 53,
  "resolvers": ["8.8.8.8"],
  "timeout": 5,
  "listener": "0.0.0.0",
  "SOAMname": "root.ns1.mesos",
  "SOARname": "ns1.mesos",
  "SOARefresh": 60,
  "SOARetry":   600,
  "SOAExpire":  86400,
  "SOAMinttl": 60,
  "dnson": true,
  "httpon": true,
  "httpport": 8123,
  "externalon": true,
  "recurseon": true
}
```

You next need this ``hosts.j2`` file so Ansible can update your ``/etc/hosts`` file:

```
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
192.168.33.10 node1
192.168.33.11 node2
192.168.33.12 node3
192.168.33.13 node4
```

And this ``resolv.conf.j2`` file to update ``/etc/resolv.conf``:

```
nameserver 192.168.33.10
```

This will solve the problem of having proper host:ip mappings in our little cluster.
Modify the ``Vagrantfile`` to be like this now:

```
ANSIBLE_GROUPS = {
              "master" => ["node1"],
              "nodes" => ["node2", "node3", "node4"],
              "all_groups:children" => ["master", "nodes"]
            }


Vagrant.configure(2) do |config|
    config.vm.box = "bento/centos-7.1"
    config.vm.define "node1" do |node1|
        node1.vm.network "private_network", ip: "192.168.33.10"
        node1.vm.hostname = "node1"
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
        node3.vm.provision "ansible" do |ansible|
            ansible.playbook = "playbook.yml"
            ansible.groups = ANSIBLE_GROUPS
        end
    end

    config.vm.define "node4" do |node4|
        node4.vm.network "private_network", ip: "192.168.33.13"
        node4.vm.hostname = "node4"
        node4.vm.provision "ansible" do |ansible|
            ansible.playbook = "playbook.yml"
            ansible.groups = ANSIBLE_GROUPS
        end
    end
end
```

Notice this is now stripped of the default comments and I've done the following to it:

* Created an ``ANSIBLE_GROUPS`` variable to store our groupings for hosts.
* Added a ``node.vm.provision`` block to each node.
* Added the ``ansible.playbook`` and ``ansible.groups`` settings inside that.
* Removed the use of the ``mesos-master`` box from our previous exercises for ``node1``.

Enter this command to get ``node1`` working:

```
$ vagrant up node1
```

That should run every single thing necessary to get a master node up.  You should do the
usual tests of Marathon, Chronos, and Mesos as you've learned in Module 1.

Append the configuration for the slave nodes (node2-4) to ``playbook.yml``:

```
- hosts: nodes
  remote_user: vagrant
  become: yes
  become_method: sudo
  tasks:
      - name: update hosts file
        template: src=./hosts.j2 dest=/etc/hosts
      - name: install mesosphere yum repo
        yum: name=http://repos.mesosphere.com/el/7/noarch/RPMS/mesosphere-el-repo-7-1.noarch.rpm state=present
      - name: install mesos and docker packages
        yum: pkg=device-mapper-event-libs,mesos,docker state=latest
      - name: configure dns
        template: src=./resolv.conf.j2 dest=/etc/resolv.conf 
      - name: configure containerizers
        lineinfile: dest=/etc/mesos-slave/containerizers create=yes line="docker,mesos"
      - name: set zookeeper master
        replace: dest=/etc/mesos/zk regexp="localhost" replace="192.168.33.10"
      - name: start mesos-slave
        service: name=mesos-slave state=started enabled=yes
      - name: start docker
        service: name=docker state=started enabled=yes
      - name: install outyet
        shell: docker load --input=/vagrant/outyet.tar.gz
```

Run this command to bring up your nodes:

```
$ vagrant up
```

And the remaining nodes will come up and be installed, but this time Vagrant will run Ansible to automatically configure everything.  This takes a while, but you can look at the Marathon GUI to watch everything come online while it's running.


Further Study
-------------

* Destroy the whole cluster and recreate it with ``vagrant up``.
* Review the Ansible documentation and learn more about it.



