---
layout: doc
title: Exercise 7 – Building and Running Mesos DNS
---

After you have a basic system working that can start services and keep them running Mesos DNS. Mesos DNS provides dynamic DNS naming for services running on a
Mesos cluster.  It also acts as a stateless fault tolerant DNS proxy so that you can
use it for normal DNS queries as well as Mesos name lookups.

In this exercise:

1. Install the Go open source programming language.
2. Use Go to build Mesos DNS.
3. Configure Mesos DNS to be your DNS server for ``node1``.
4. Start Mesos DNS in Marathon so that it only runs on ``node1``.
5. Run Mesos DNS and try using it to find Mesos services by using simple DNS queries with the ``host`` command.


Video Lecture
-------------

Mesos-DNS is currently being updated to a new release out soon at which point we'll have a new video and instructions for it.


Quick Reference
---------------

You can find more information about Mesos DNS at http://mesosphere.github.io/mesos-dns/docs/.

Install the Go programming language:

{{ mesos.code("ex7/install_mesos_dns.sh-session", section="yum") }}

Then build the mesos-dns project:

{{ mesos.code("ex7/install_mesos_dns.sh-session", section="build") }}

Add ``nameserver 192.168.33.10`` to the first line of the ``/etc/resolv.conf`` file:

{{ mesos.code("ex7/resolv.conf.txt") }}

Mesos DNS uses a file named ``config.json`` which you can copy a sample of:

{{ mesos.code("ex7/run_mesos_dns.sh-session", section="config") }}

Modify the ``config.json`` to use the vagrant IP of 192.168.33.10 and change the port from 8053 to 53 so it looks like this:

{{ mesos.code("ex7/config.json") }}

In this file the ``zk`` setting tells Mesos DNS where the ZooKeeper server is located, and the ``masters`` option acts as a backup list of masters in case ZooKeeper is down, or as an alternative to the ``zk`` setting.  The ``zk`` setting wins over the ``masters`` setting.

Test that mesos-dns runs locally first:

{{ mesos.code("ex7/run_mesos_dns.sh-session", section="run") }}

Create a mesos-dns launcher in Marathon by using the GUI with this command:

{{ mesos.code("ex7/run_mesos_dns.sh-session", section="gui") }}

Add this in the ``Constraints`` field::

    hostname:CLUSTER:node1

This tells Marathon to only offer it to the ``node1`` host where you have installed the ``mesos-dns`` package.
Validate that you can see the host command starts working again:

{{ mesos.code("ex7/test.sh-session", section="host") }}

Use the mesos-dns for service discovery with the dig command.  You can search against Marathon apps by using the name of the app at the ``marathon.mesos`` domain.  If you installed Mesos DNS in Marathon as ``dns`` this this should work:

{{ mesos.code("ex7/test.sh-session", section="digdns") }}

If you installed the ``test`` app from previous exercises then this:

{{ mesos.code("ex7/test.sh-session", section="digtest") }}

You can also use the SRV records to get ports by using the app name and the port type with underscores like ``_NAME._PORT`` so ``_test._tcp`` is for the ``test`` app's TCP port:

{{ mesos.code("ex7/test.sh-session", section="srv") }}

However that's not very useful because SRV records are disconnected from the hosts they belong to.  A better way is to use the REST API to get an exact mapping:

{{ mesos.code("ex7/test.sh-session", section="api") }}

There are more REST calls you can make, documented at [the Mesos-DNS API documentation](http://mesosphere.github.io/mesos-dns/docs/http.html).

Further Study
-------------

* Take the Mesos DNS process down by using the ``kill`` command and see that Marathon brings it back.
* Use Marathon to take Mesos DNS down and bring it back up.
* Read the [Mesos DNS Reference Documentation](http://mesosphere.github.io/mesos-dns/docs/configuration-parameters.html)


