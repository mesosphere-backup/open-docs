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

{{ mesos.code("ex20/playbook.yml", section="slaves") }}

This is effectively adding cleaning out some ``mesos-slave`` state before the server starts, but later we'll do this again to ``node2`` to get it ready for saving.

Run ``vagrant destroy``:

{{ mesos.code("ex20/build.sh-session", section="destroy") }}

To confirm that your ``playbook.yml`` works and can build the master and the first slave.  Once it comes up, node2 should not have ``mesos-slave`` running and there's nothing in ``/tmp`` because you cleared the state in the ``playbook.yml``.  Next you halt ``node2`` so you can package it:

{{ mesos.code("ex20/build.sh-session", section="halt") }}

Save the ``node2`` Vagrant box to a new ``mesos-slave`` box:

{{ mesos.code("ex20/build.sh-session", section="package") }}

Destroy the ``node3`` and ``node4`` to get them ready to build based on the new configuration:

{{ mesos.code("ex20/build.sh-session", section="destroy34") }}

You have to do this before changing the ``Vagrantfile`` or else Vagrant can't find them.

Change the configuration for ``node3`` and ``node4`` to:

{{ mesos.code("ex20/Vagrantfile.rb", section="node34") }}

Run ``vagrant up`` to build using the node template rather than with Ansible.  After that all the nodes should be ready, but in a default clean state.  Simply restart them and they'll fire up as new slave nodes:

{{ mesos.code("ex20/build.sh-session", section="up") }}

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

{{ mesos.code("ex20/playbook_full.yml") }}

And your final ``Vagrantfile`` is this:

{{ mesos.code("ex20/Vagrantfile_full.rb") }}

With these two files, and the ``marathon`` and ``chronos`` configuration directories, you are now able to build a full Mesos cluster repeatably and you should be able to
move this similar build to your own cluster.

Further Study
-------------

This is the end of the first course.  More to come as we receive feedback on it and will have some further study then.

