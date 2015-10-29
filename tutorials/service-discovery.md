---
layout: doc
title: Service Discovery
redirect_from: /getting-started/service-discovery/
---

Service discovery is an essential configuration step when running a modern application distributed across a data center to allow easy network communication between services.

This document outlines a common approach to service discovery for web services running on Mesosphere’s [Marathon](https://github.com/mesosphere/marathon). While this approach focuses on one specific example application, it can be extended to most stateless services running on Marathon. This applies to services running using containerizers that Mesos ships with (cgroups, Docker) or external containerizers.

## Overview

This approach to service discovery for Marathon applications makes use of the popular [HAProxy](http://www.haproxy.org/) TCP/HTTP load balancer along with an assistant script that uses [Marathon’s REST API](https://mesosphere.github.io/marathon/docs/rest-api.html) to periodically re-generate a HAProxy configuration file.

Mesos slaves are configured to provide a range of ports as a resource (the default range is 31,000 - 32,000). When a new instance of a task is started by Marathon on a Mesos slave, it binds to one or more arbitrary ports within this range.

<div class="alert alert-info">
  Note the distinction between the actual port that the application binds to and the port that is configured for the application in Marathon. The configured port in Marathon (commonly known as the application port) is merely a way of namespacing applications run by Marathon and is not directly bound to. It is intended to be used by a secondary load balancer or proxy system, such as HAProxy. For example, this prevents a user from configuring two services on the same cluster that they eventually intend to both run on port 80.
</div>

Service discovery, as described in this tutorial, allows Marathon applications to assume they can communicate with other Marathon applications on their configured Marathon application port. For example, a Ruby on Rails application running on port 80 can assume that it can reach a backend Java application running on port 8080 by simply connecting to `localhost:8080`.

HAProxy will then route the request to a host and port where an instance of the service is actually running. If it is unable to connect to that host and port, it will cycle through to the next configured instance of that service.

<div class="alert alert-info">
  <strong> Note: </strong> Any services not run using Marathon (for example, a database server) should be connected to / addressed in the normal fashion.
</div>

In the approach described in the following sections, `haproxy-marathon-bridge`, a shell script provided with Marathon, connects to Marathon to retrieve the current hostnames, the actually bound ports of the running application instances and the configured application ports. Typically this is run at a 60 second schedule, using `cron`. HAProxy does not need to be restarted, the script checks if there is a diff between the new config and the active config and will signal HAProxy to reload its config if necessary.

The diagram below shows how this might look for a cluster where we run two services, SVC1 and SVC2 and configure two instances of each with applications ports of 1111 and 2222 respectively.

The actual task ports allocated by Mesos are 31100 and 31200 respectively. However, HAProxy is configured to route requests to the application port configured by the user to the actual task port allocated by Mesos.

<img src="{% asset_path service-discovery/1.png %}" alt ="" width="100%">

If SVC2 on Slave 2 then attempts to connect to SVC1 at `localhost:2222`, HAProxy will route the request to the first configured SVC1 instance. In this case, the one running on Slave 1.

<img src="{% asset_path service-discovery/2.png %}" alt="" width="100%">

If disaster strikes and Slave 1 goes offline, the next request to `localhost:2222` will be routed to Slave 2.

<img src="{% asset_path service-discovery/3.png %}" alt="" width="100%">

## Prerequisites

* A cluster running Mesos 0.20.1+ and Marathon 0.7.3+

* [HAProxy](http://www.haproxy.org/) installed and running on each Mesos node

* DNS service that offers healthchecks (e.g., [Amazon Route 53](http://aws.amazon.com/route53/))

## Installation

### `haproxy-marathon-bridge` Installation

We will install the `haproxy-marathon-bridge` script on every node. This is for two purposes:

* To allow services running on a cluster to discover other services also running on the cluster. This is accomplished by running the script on each slave node.

* To allow external requests to be routed to services running on the cluster. This is accomplished by running the script on each master node. (This does not need to run on the master nodes, but for simplicity, we re-use them in this doc.)

To install the [`haproxy-marathon-bridge` script](https://github.com/mesosphere/marathon/blob/master/bin/haproxy-marathon-bridge) on each node:

1. Download the `haproxy-marathon-bridge` script:

```bash
wget https://raw.githubusercontent.com/mesosphere/marathon/master/bin/haproxy-marathon-bridge
```

2. Create a configuration file at `/etc/haproxy-marathon-bridge/marathons` for the script to use. This should contain the host and port of each running Marathon instance on a new line:

```bash
marathon1.company.com:8080
marathon2.company.com:8080
marathon3.company.com:8080
```

3. Install the script as a cron job by running:

```bash
./haproxy-marathon-bridge install_cronjob
```

4. We're done! A cron job will now run every minute and update the haproxy configuration at `/etc/haproxy/haproxy.cfg`. If this changes, HAProxy will reload its configuration.

### DNS Configuration for Incoming External Traffic

At the very front of your cluster you will need a load balancing and availability solution for incoming traffic. One simple way of doing this is with Amazon's [Route53](http://aws.amazon.com/route53/) service along with [Cloudwatch](http://aws.amazon.com/cloudwatch/) health checks. The specific steps to do this for a typical web service are:

1. Configure static IPs and publicly expose either port 80 or 443 (as required) on the set of hosts that you want to use for external load balancing. (This could be any set of hosts that you are happy to route traffic through as long as it has HAProxy installed and configured as in the previous section.)

2. Create a Route53 Health Check for each of the servers. Each health check entry should be configured with the public facing IP address of the server, the desired protocol (HTTP or HTTPS) and port (80 or 443).

3. Create a Route53 A record for each server instance, e.g. `public.example.com` => `10.0.0.10`, with a TTL of 60 seconds.

4. For each A record configure a routing policy of `weighted`, with a weight of 10, a unique `Set ID` name, enable Health Checks, and associate each record with the matching Health Check.

5. For this DNS record, Route53 will now route traffic to healthy instances. The HAProxy on each instance will route the traffic to the correct node running the configured service within the cluster.


## Marathon Example Definitions

Below are some example Marathon application definitions for typical services run on a cluster.
To use these, [Docker](https://www.docker.com/) will need to be installed on each slave node. 

These address containers that use *host* based networking. Using *bridge* networking requires some extra work to allow services inside the container to resolve the proxy (see [building your own bridge](https://docs.docker.com/articles/networking/#building-your-own-bridge) for how this might be accomplished).

### Web server with host-based networking and health checks
The configuration below is for a typical web server that operates on both port 80 and port 443. Replace the dummy `container.docker.image` value with a valid Docker hub image for your web server.


```json
{
  "id": "/webapp",
  "env": {
    "DATABASE_HOST": "1.2.3.4",
    "DATABASE_PASSWORD": "",
    "MODE": "PRODUCTION",
    "APP_HTTP_PORT": "$PORT0",
    "APP_HTTPS_PORT": "$PORT1"
  },
  "instances": 3,
  "cpus": 0.5,
  "mem": 1024,
  "ports": [
    80,
    443
  ],
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "dockerrepo/webapp:d985f15e30c1ac186125e041e7b0ad3d876208ba"
    }
  },
  "healthChecks": [
    {
      "path": "/",
      "protocol": "HTTP",
      "portIndex": 0,
      "gracePeriodSeconds": 300,
      "intervalSeconds": 10,
      "timeoutSeconds": 20,
      "maxConsecutiveFailures": 3
    }
  ]
}
```

### Web service with host-based networking and health checks
The configuration below is for a typical web service that operates on port 8081. Again, replace the dummy `container.docker.image` value with a valid Docker hub image for your web service.


```json
{
  "id": "/serviceapp",
  "instances": 3,
  "cpus": 0.5,
  "mem": 1024,
  "disk": 0,
  "ports": [
    8081
  ],
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "dockerrepo/serviceapp:2e53c51ede0c451bdb82302986bb6a6951d1aff7"
    }
  },
  "healthChecks": [
    {
      "path": "/ping",
      "protocol": "HTTP",
      "portIndex": 0,
      "gracePeriodSeconds": 60,
      "intervalSeconds": 10,
      "timeoutSeconds": 20,
      "maxConsecutiveFailures": 3
    }
  ]
}
```

## Scaling & Fault-tolerance

### What happens if a node is added to the cluster?

As long as the `haproxy-marathon-bridge` script is configured and a Mesos slave process is running the node will join the cluster and function the same way as other nodes. As and when Marathon starts application instances on it, HAProxy will update to route traffic to it.

### What happens if the number of instances of my application are increased in Marathon?

Marathon will deploy the new instances to cluster nodes as and where there is spare capacity. The next time the HAProxy configuration is updated the new instances will be available for traffic to route to.

### What happens if an instance goes down?

If an application instance fails, it will be removed as a routable destination the next time the HAProxy configuration is refreshed.

## Limitations & Caveats

As with any service discovery solution, there are some specific nuances to the behavior provided by this approach. These are listed below:

* HAProxy timeouts may need to be customized in the `haproxy-marathon-bridge` script depending on the application.

* The generated HAProxy config is best suited to stateless services since there is no guarantee you will be routed to the same application instance each time. More advanced configuration can be gained by customizing the script.

* Each Marathon app running on the cluster must have a dedicated application port which is used for service discovery. To run separate instances of a Marathon application on the same Mesos cluster, you will need a unique port for each application instance.

* For incoming traffic, it is possible for 1-3 minutes of service interruption if one of the load balancing hosts fail. The factors which contribute to this time are:

    * Cloudwatch Request Interval (default: 30 seconds)

    * Cloudwatch Failure Threshold (default: 3)

    * Route53 A record TTL (suggested: 60 seconds)

* For traffic between internal services, it is possible for small windows of service interruption within the cluster if a task or host fails. The factors which contribute to this time are:

    * The Marathon application’s [health-check configuration](https://mesosphere.github.io/marathon/docs/health-checks.html):

        * gracePeriodSeconds (default: 15 seconds)

        * intervalSeconds (default: 10 seconds)

        * maxConsecutiveFailures (default: 3)

        * timeoutSeconds (default: 20 seconds)

    * haproxy-marathon-bridge cron interval (default: 60 seconds)

* The dockerized application must bind to the dynamic ports provided by Marathon using the environment variables $PORT0, $PORT1, …


## Alternative Approaches

[Qubit](http://qubitproducts.com/) provides Bamboo, a "web daemon that automatically configures HAProxy for web services deployed on Apache Mesos and Marathon". See the [Bamboo GitHub repository](https://github.com/QubitProducts/bamboo) for more.
