---
layout: doc
title: Exercise 7 – Building and Running Mesos DNS

redirect_from:
- /intro-course/ex7.html
---

After the last few exercises, you now have a basic system that can start services and keep them running. We will now set up Mesos DNS to run within this system. Mesos DNS provides dynamic DNS naming for services running on a Mesos cluster.  It also acts as a stateless fault tolerant DNS proxy so that you can use it for normal DNS queries as well as Mesos name lookups.

In this exercise:

1. Install the Go open source programming language.
2. Use Go to build Mesos DNS.
3. Configure Mesos DNS to be your DNS server for ``node1``.
4. Start Mesos DNS in Marathon so that it only runs on ``node1``.
5. Run Mesos DNS and try using it to find Mesos services by using simple DNS queries with the ``host`` command.


Video Lecture
-------------

A new release of Mesos-DNS will be coming soon, at which point we'll have a new video and instructions for it.


Quick Reference
---------------

You can find more information about Mesos DNS, along with additional tutorials, by checking [the Mesos DNS docs](http://mesosphere.github.io/mesos-dns/docs/).

Install the Go programming language:

```
[node1]$ sudo yum -y install golang git bind-utils
```


Then build the mesos-dns project:

```
[node1]$ mkdir ~/go
[node1]$ export GOPATH=$HOME/go
[node1]$ export PATH=$PATH:$GOPATH/bin
[node1]$ go get github.com/tools/godep
[node1]$ go get github.com/mesosphere/mesos-dns
[node1]$ cd $GOPATH/src/github.com/mesosphere/mesos-dns
[node1]$ godep go build .
```

Add ``nameserver 192.168.33.10`` to the first line of the ``/etc/resolv.conf`` file:

```
nameserver 192.168.33.10
```

Mesos DNS uses a file named ``config.json`` which you can copy a sample of:

```
[node1]$ cp config.json.sample config.json
```

Modify the ``config.json`` to use the vagrant IP of 192.168.33.10 and change the port from 8053 to 53 so it looks like this:

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

In this file the ``zk`` setting tells Mesos DNS where the ZooKeeper server is located, and the ``masters`` option acts as a backup list of masters in case ZooKeeper is down, or as an alternative to the ``zk`` setting.  The ``zk`` setting wins over the ``masters`` setting.

Test that mesos-dns runs locally first:

```
[node1]$ sudo /home/vagrant/go/src/github.com/mesosphere/mesos-dns/mesos-dns -v=1 -config=/home/vagrant/go/src/github.com/mesosphere/mesos-dns/config.json
```

In the Marathon GUI, create a new launcher named ``dns`` which uses the command we just tested:

```
[node1]sudo /home/vagrant/go/src/github.com/mesosphere/mesos-dns/mesos-dns -v=1 -config=/home/vagrant/go/src/github.com/mesosphere/mesos-dns/config.json
```

Add this in the ``Constraints`` field::

    hostname:CLUSTER:node1

This tells Marathon to only offer it to the ``node1`` host where you have installed the ``mesos-dns`` package.
Validate that you can see the host command starts working again:

```
[node1]$ host google.com
```

Use the mesos-dns for service discovery with the dig command. You can search against Marathon apps by using the name of the app at the ``marathon.mesos`` domain.  If you installed Mesos DNS in Marathon as ``dns`` this should work:

```
[node1]$ dig dns.marathon.mesos
```

If you installed the ``test`` app from previous exercises then this:

```
[node1]$ dig test.marathon.mesos
```

You can also use the SRV records to get ports by using the app name and the port type with underscores like ``_NAME._PORT`` so ``_test._tcp`` is for the ``test`` app's TCP port:

```
[node1]$ dig _test._tcp.marathon.mesos SRV
```

However that's not very useful because SRV records are disconnected from the hosts they belong to.  A better way is to use the REST API to get an exact mapping:

```
[node1]$ curl http://192.168.33.10:8123/v1/hosts/dns.marathon.mesos
```

There are more REST calls you can make, documented at [the Mesos-DNS API documentation](http://mesosphere.github.io/mesos-dns/docs/http.html).

Further Study
-------------

* Take the Mesos DNS process down by using the ``kill`` command and see that Marathon brings it back.
* Use Marathon to take Mesos DNS down and bring it back up.
* Read the [Mesos DNS Reference Documentation](http://mesosphere.github.io/mesos-dns/docs/configuration-parameters.html)


