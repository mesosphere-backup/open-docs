---
layout: doc
title: Exercise 15 – Starting Four Nodes

redirect_from:
- /intro-course/ex15.html
---

This exercise adds two more slave nodes to our small
cluster.  These nodes are designed to mostly run the Docker/Go ``outyet``
web application that we've been using.  The process is made easier by a convenient
shell script that you can turn into a Chef, Puppet recipe.

In this exercise:

1. Edit the ``Vagrantfile`` to include the new nodes #3 and #4.
2. Create a file named ``installnode.sh`` on the host machine to use in other nodes.
3. Alter the ``/etc/hosts`` files as usual.
4. Use the ``installnode.sh`` script to automatically install everything and get ``outyet`` running.
5. Use Marathon to scale up to 4 Outyet instances.

Be forewarned that your computer processor might only be able to
do three nodes.


Video Lecture
-------------

{% mesos_video Mesos-Intro-Lecture-15 %}


Quick Reference
---------------

Add a new section to the ``Vagrantfile`` for ``node3`` and ``node4``:

```
config.vm.define "node3" do |node3|
    node3.vm.network "private_network", ip: "192.168.33.12"
    node3.vm.hostname = "node3"
end

config.vm.define "node4" do |node4|
    node4.vm.network "private_network", ip: "192.168.33.13"
    node4.vm.hostname = "node4"
end
```

Run ``vagrant up`` to ensure that ``node3`` and ``node4`` come up.

You next need to fix all the ``/etc/hosts`` files on all machines.  Easest way to do that is create a
file in the ``vm-install`` directory named ``hosts.j2`` (you'll see why later) with these contents:

```
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
192.168.33.10 node1
192.168.33.11 node2
192.168.33.12 node3
192.168.33.13 node4
```

With that you can do this on each host using this little shell script, or type this all on one line:

```
for i in node1 node2 node3 node4;
    do vagrant ssh $i -c 'sudo cp /vagrant/hosts.j2 /etc/hosts';
done
```

And that will fix all of them to have the correct IP addresses and host names.

To install all the required software, I created a shell script named ``installnode.sh`` to do create new nodes:

```
rpm -Uvh http://repos.mesosphere.com/el/7/noarch/RPMS/mesosphere-el-repo-7-1.noarch.rpm
yum -y install mesos device-mapper-event-libs docker

# point this node at the mesos master
sed -i -e 's/localhost/192.168.33.10/g' /etc/mesos/zk
echo 'docker,mesos' | sudo tee /etc/mesos-slave/containerizers

service mesos-slave start
chkconfig mesos-slave on
chkconfig mesos-master off

chkconfig docker on
service docker start
docker load --input=/vagrant/outyet.tar.gz
```

Save this to ``installnode.sh`` in your host directory and then on ``node3`` you can run this command to get it to build this node:

```
$ vagrant ssh node3
[node3]$ sudo sh /vagrant/installnode.sh
```

Run the Docker command to test the node:

```
[node3]$ sudo docker run --publish 6060:8080 --name test --rm outyet
```

Repeat these steps for ``node4`` and then you can go into Marathon and again expand it out to 4 instances of this web application running.

Further Study
-------------

* Create a periodic task with Chronos and see how it runs on the cluster.
* Take nodes down and see how Mesos and Marathon deal with it.


