---
layout: doc
title: Exercise 17 – Advanced Usage of the Marathon
---

After you have Ansible creating a repeatable build of your four node mini-cluster you'll want to also rebuild your Marathon configuration.  The Marathon GUI is good for basic Marathon usage, but the real power comes from using the Marathon REST API.  Using the REST API you can keep track of your configurations in a ``git`` repository, providing you with version control and use the API to change or rebuild your configurations as needed.

In this exercise:

1. Create a simple Marathon configuration repository with .json files for configuration.
2. Use ``curl`` to post them to Marathon as part of the Ansible build.
3. Add health checks to your Marathon tasks to ensure quality of service.
4. Configure SSL and a Basic Authentication password for Marathon to secure it.
5. Review the Marathon documentation to learn about other advanced topics.


Video Lecture
-------------

{{ mesos.video("Mesos-Intro-Course-17") }}


Quick Reference
---------------

In your VM directory make a ``marathon`` directory and get it started with ``git init``:

{{ mesos.code("ex17/setup_marathon.sh-session") }}

Make a ``webapp.json`` file:

{{ mesos.code("ex17/webapp.json") }}

Use this simple ``post.sh`` bash script to make it easier to load JSON files into Marathon:

{{ mesos.code("ex17/post.sh") }}

This is simply using ``curl`` to loop through every .json file and then send it to Marathon with a POST HTTP request.
Run this to add your webapp to it:

{{ mesos.code("ex17/setup_post.sh-session", section="executable") }}

Create the ``dns.json`` file for Mesos DNS:

{{ mesos.code("ex17/dns.json") }}

Create this ``outyet.json`` file to setup the outyet application:

{{ mesos.code("ex17/outyet.json") }}

Run ``post.sh`` from the ``marathon`` directory to have it install your applications:

{{ mesos.code("ex17/setup_post.sh-session", section="rerun") }}

Add this to your Ansible ``playbook.yml`` in the ``hosts: master`` section so that it's done during your build:

{{ mesos.code("ex17/playbook.yml", section="startmarathon") }}

Additional Commands
-------------------

This automates your Marathon configuration and adds it to the Ansible ``playbook.yml`` file so that you can repeat it.  You'll also need to know the following common commands::

    # list out the apps availale
    curl http://192.168.33.10:8080/v2/apps

    # delete an app from Marathon
    curl -X DELETE http://192.168.33.10:8080/v2/apps/webapp

    # update the configuration of an app
    curl -X PUT http://192.168.33.10:8080/v2/apps/webapp -dwebapp.json -H "Content-type: application/json"

    # list the tasks of an app
    curl http://192.168.33.10:8080/v2/apps/webapp/tasks

    # delete the tasks of an app
    curl -X DELETE http://192.168.33.10:8080/v2/apps/webapp/tasks

Further Study
-------------

* Read more about the API endpoints available for Marathon at https://mesosphere.github.io/marathon/docs/rest-api.html
