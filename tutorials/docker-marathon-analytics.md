---
layout: doc
title: Building a Web Application with Analytics Using Docker and Marathon
---

This tutorial shows you step-by-step how to build a web application, including the analytics part, using Docker and Marathon. An earlier version of this demo app was presented at [XebiCon 2015 in Amsterdam][1], in case you want to [check it out][2].

First, let's have a look at the architecture and the environment into which we're deploying.

## Architecture

The application, called m-shop, is a fictional merchandising shop consisting of the web application (nginx+Redis) and the analytics part, realized through the ELK (Elasticsearch, Logstash and Kibana) stack. Here's the architecture:

[<img src="https://mesosphere.com/wp-content/uploads/2015/06/m-shop-architecture-final-800x532.png" alt="m-shop-architecture-final" width="800" height="532" class="aligncenter size-large wp-image-2390" />][3]

Note the `system` part (consisting of Mesos/Marathon and the service discovery) as well as the `application` part. In order to keep things simple and easy to replicate, I chose [Playa Mesos][4] (a Vagrant box that comes with Mesos and Marathon pre-installed) as the deployment environment.

## Walkthrough: from Marathon to the ELK stack

If you're just interested in how things work, check out this video where I walk through the setup:

[embed]https://www.youtube.com/watch?v=kvfTWoZ3GOg[/embed]

If you want to try it out yourself, this is what you'll need to do. First, install Playa Mesos and clone the GitHub repo [mhausenblas/m-shop][5]. Then, you need to prepare the Mesos-DNS part by creating [config.js][6] in `/etc/mesos-dns/` on your Vagrant box. From here, we're ready to deploy the application. Change into the directory where you've cloned the GitHub repo (in my case `~/m-shop`):

    ~/m-shop $ http PUT http://10.141.141.10:8080/v2/groups < mesos-dns/system.json
    ~/m-shop $ http POST http://10.141.141.10:8080/v2/groups < m-shop.json
    

Now we have both the system and app parts deployed, and when heading over to the browser at <http://10.141.141.10:8080>, we should see something like the following:

[<img src="https://mesosphere.com/wp-content/uploads/2015/06/marathon-screenshot-800x226.png" alt="marathon-screenshot" width="800" height="226" class="aligncenter size-large wp-image-2385" />][7]

The two application specification files [m-shop.json][8] and [system.json][9] we just used to deploy define all the groups, applications and dependencies necessary:

[<img src="https://mesosphere.com/wp-content/uploads/2015/06/m-shop-groups-dep-800x443.png" alt="m-shop-groups-dep" width="800" height="443" class="aligncenter size-large wp-image-2389" />][10]

One note on the service discovery part: application IDs used in Marathon, such as `/m-shop/site/webdis`, are [translated][11] by Mesos-DNS into [RFC952][12] compliant names -- in this case `webdis-site-m-shop.marathon.mesos`. You can check this yourself using a common DNS tool in the Vagrant box:

    vagrant@mesos:~$ dig _webdis-site-m-shop._tcp.marathon.mesos SRV
    
    ; <<>> DiG 9.9.5-3ubuntu0.2-Ubuntu <<>> _webdis-site-m-shop._tcp.marathon.mesos SRV
    ;; global options: +cmd
    ;; Got answer:
    ;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 62784
    ;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1
    
    ;; QUESTION SECTION:
    ;_webdis-site-m-shop._tcp.marathon.mesos. IN SRV
    
    ;; ANSWER SECTION:
    _webdis-site-m-shop._tcp.marathon.mesos. 60 IN SRV 0 0 31000 webdis-site-m-shop-46886-s0.marathon.mesos.
    
    ;; ADDITIONAL SECTION:
    webdis-site-m-shop-46886-s0.marathon.mesos. 60 IN A 10.141.141.10
    
    ;; Query time: 3 msec
    ;; SERVER: 127.0.0.1#53(127.0.0.1)
    ;; WHEN: Sun Jun 21 10:47:21 UTC 2015
    ;; MSG SIZE  rcvd: 216
    

Above is a DNS query telling you that the `webdis-site-m-shop.marathon.mesos` service is available through `10.141.141.10:31000` and what the service discovery component [SeDi][13] does, using the Mesos-DNS [HTTP API][14].

From an end-user perspective, probably the most interesting part is the web application front-end, realized through nginx:

[<img src="https://mesosphere.com/wp-content/uploads/2015/06/m-shop-screenshot-800x482.png" alt="m-shop-screenshot" width="800" height="482" class="aligncenter size-large wp-image-2384" />][15]

You can change the [content][16] of the website yourself if you want to play around with it. Note that you then have to change the nginx Docker image in m-shop.json from [mhausenblas/m-shop-nginx:latest][17] to your own image. To build the Docker image, change into the `frontend-static/` directory and perform the following steps (with your own repo name):

    ~/m-shop/frontend-static $ docker build -t mhausenblas/m-shop-nginx .
    ~/m-shop/frontend-static $ docker push mhausenblas/m-shop-nginx
    

In terms of the analytics part of the application, I used an [existing all-in-one image][18] containing Elasticsearch, Logstash and Kibana. Initially, you'll have to wait around 2 minutes for the ELK stack to be set up, and then perform a couple of interactions on the `/m-shop/site/nginx` app, such as clicking on some items, etc.

To confirm that you have data that Kibana can display, you can check the logs in the Vagrant box (the shared volumes between the front end and the analytics part) using `ls -al /tmp/m-shop/nginx`.

Once the Kibana UI comes up, select the `logstash-` index along with the `@timestamp` field name and you should then see something like this:

[<img src="https://mesosphere.com/wp-content/uploads/2015/06/kibana-screenshot-800x475.png" alt="kibana-screenshot" width="800" height="475" class="aligncenter size-large wp-image-2383" />][19]

I hope this little demo app gave you an idea how to build applications using Docker and Marathon, and you might want to take it as a basis to explore this space. Some further experiments worth exploring include adding a [load balancer][20] and deploying the app into the [Mesosphere Datacenter Operating System][21].

 [1]: https://xebicon.nl/slides/michael-hausenblas.pdf
 [2]: https://youtu.be/eFAbSHYI_Ts
 [3]: https://mesosphere.com/wp-content/uploads/2015/06/m-shop-architecture-final.png
 [4]: https://github.com/mesosphere/playa-mesos
 [5]: https://github.com/mhausenblas/m-shop
 [6]: https://github.com/mhausenblas/m-shop/blob/master/mesos-dns/config.js
 [7]: https://mesosphere.com/wp-content/uploads/2015/06/marathon-screenshot.png
 [8]: https://github.com/mhausenblas/m-shop/blob/master/m-shop.json
 [9]: https://github.com/mhausenblas/m-shop/blob/master/mesos-dns/system.json
 [10]: https://mesosphere.com/wp-content/uploads/2015/06/m-shop-groups-dep.png
 [11]: https://github.com/mesosphere/mesos-dns/blob/d5332addd861e4c2a4cbe963a52156b077648e60/records/labels/dns952.go#L28
 [12]: http://tools.ietf.org/html/rfc952
 [13]: https://github.com/mhausenblas/mc/blob/master/sedi.py
 [14]: http://mesosphere.github.io/mesos-dns/docs/http.html
 [15]: https://mesosphere.com/wp-content/uploads/2015/06/m-shop-screenshot.png
 [16]: https://github.com/mhausenblas/m-shop/tree/master/frontend-static/content
 [17]: https://registry.hub.docker.com/u/mhausenblas/m-shop-nginx/
 [18]: http://raulcd.com/elasticsearch-logstash-and-kibana-on-docker.html
 [19]: https://mesosphere.com/wp-content/uploads/2015/06/kibana-screenshot.png
 [20]: https://mesosphere.github.io/marathon/docs/service-discovery-load-balancing.html
 [21]: http://docs.mesosphere.com/tutorials/deploywebapp/