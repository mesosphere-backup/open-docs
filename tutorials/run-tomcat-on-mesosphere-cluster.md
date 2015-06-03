---
layout: default
title: Mesosphere Cluster Tomcat Tutorial
---

> This tutorial is designed with the expectation that you have a running Mesosphere Cluster.  If you don't then checkout our [Getting Started with Mesosphere for Google Cloud Platform](/cloud/google/getting-started/).

> This tutorial will walk you through the deploy of a running Java web application on Tomcat onto the Mesosphere cluster.

## Prerequisites

* Mesosphere cluster
* VPN connection to the cluster

## Setting Up

These instructions will walk through the deployment of [Apache Tomcat](http://tomcat.apache.org/) with a sample WAR application.  The URL locations used for this tutorial are:

* [http://www.gtlib.gatech.edu/pub/apache/tomcat/tomcat-7/v7.0.55/bin/apache-tomcat-7.0.55.tar.gz](http://www.gtlib.gatech.edu/pub/apache/tomcat/tomcat-7/v7.0.55/bin/apache-tomcat-7.0.55.tar.gz)
* [https://gwt-examples.googlecode.com/files/Calendar.war](https://gwt-examples.googlecode.com/files/Calendar.war)

This article will reference the Mesos and Marathon web console.  Access to these consoles is available at the IP address or hostname of the Mesosphere Master through a browser.  Mesos is available at `http://<master>:5050` and Marathon is at `http://<master>:8080`.

## Deployment through Marathon

1. Open the Marathon console at `http://<master>:8080`.
<img src="{% asset_path marathon.png %}" alt="" width="60%">
1. Click "New App" in the upper right corner.
1. Fill out the following details:
    a. ID: tomcat
    b. CPUs: 0.5
    c. Memory: 512
    d. Command:  mv \*.war apache-tomcat-\*/webapps && cd apache-tomcat-\* && sed "s/8080/$PORT/g" < ./conf/server.xml > ./conf/server-mesos.xml && ./bin/catalina.sh run -config ./conf/server-mesos.xml
    e. URIs: http://www.gtlib.gatech.edu/pub/apache/tomcat/tomcat-7/v7.0.55/bin/apache-tomcat-7.0.55.tar.gz, https://gwt-examples.googlecode.com/files/Calendar.war
  1. Click "Create"

It will take a few minutes, but you just launched an instance of Tomcat on a Mesosphere cluster.  The service is available as soon as the instances count changes from `0/1` to `1/1`.

<img src="{% asset_path marathon-tomcat-running.png %}" alt="" width="60%">

When using Marathon's [HAProxy bridge](https://github.com/mesosphere/marathon/blob/master/bin/haproxy-marathon-bridge), which is provisioned with Mesosphere for Google Cloud Platform, then the newly created service is registered with HAProxy on the master at the "application port".   In the configuration above we did not specify an application port (which defaults to 0).  The result is a random port.

It is possible to click on the line with the app, which is indicated with a hover over effect.  Clicking it will bring up the application configuration revealing the application details including the application port.

<img src="{% asset_path marathon-tomcat-config.png %}" alt="" width="60%">

In the example above, `10.129.38.22:31541` provides access to the service we just deployed.  `31541` is the random application port.  You may notice that `10.129.38.22` is a master.   This service is automatically registered with HAProxy on the master.  In this example access to the newly deployed calendar application is available at [http://10.129.38.22:31541/Calendar/Calendar.html](http://10.129.38.22:31541/Calendar/Calendar.html).

Port 31541 is the application port (at HAProxy), if you are curious what port the tomcat instance is really click the "Configuration" tab.  At time of this writing, the port is 32767.

## Scaling up with Marathon

Marathon makes scaling easy!  Notice in the last illustration above the "Scale" button.  Click the button and pick a number:)  For this example, lets enter 3, then submit with the "ok".

Upon submission the tasks screen will change to indicate there are new applications in "Staging" status.

<img src="{% asset_path marathon-tomcat-scaling.png %}" alt="" width="60%">

You now have 3 instances of the Tomcat fronted at the HAProxy endpoint (10.129.38.22:31541 in this example).


## Where are my tasks running?

Where are your tasks running?  The beauty of Mesosphere is that it doesn't matter.  However that information is availble.  Time to look at the Mesos web console.  Open a browser to `http://<master>:5050` in this example [http://10.144.122.3:5050](http://10.144.122.3:5050).   One of the many details provided by the mesos web console is the list of active tasks.

<img src="{% asset_path mesos-active-tasks.png %}" alt="" width="60%">

In this example all 3 tasks are running on different machines indicated by unique host IP addresses.

## Fault Tolerance with Mesosphere

Now that we know where the tasks are running, lets ssh into the slave and see what happens when a task is killed.

1. SSH into a slave
`ssh jclouds@10.210.6.72`

2. Find the Tomcat PID and kill it

```sh
$ ps -ef | grep Bootstrap
# replace the PID 5451 below with the PID you find
$ sudo kill 5451
```

If you have Marathon up, you will see instance count change from `3/3` to `2/3`.  After a short period of time it will return to `3/3`.  As long as the 2 remaining Tomcat instances are capable of handling the current load of calendaring activties, there is no disruption in services as Marathon recovers the 3rd instance.

## Summary

This is tutorial you walked through deploying and scaling a Tomcat application.  You learned that Mesosphere provides auto load-balances your services and provides fault tolerance.

