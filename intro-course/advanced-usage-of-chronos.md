---
layout: doc
title: Exercise 18 – Advanced Usage of Chronos
---

You can access a more advanced set of Chronos features through the REST API than through the GUI.  This exercise is similar to the last one, but you'll use pre-built tools to manage your Chronos configuration JSON files.

In this exercise you will:

1. Create a simple configuration for a periodic job.
2. Setup your repository for storing the configuration.
3. Use the sync tool to synchornize your configuration to Chronos inside Ansible.
4. Review the documentation for more advanced topics.



Video Lecture
-------------

{{ mesos.video("Mesos-Intro-Course-18") }}


Quick Reference
---------------

Get an idea of the current jobs you have installed using ``curl``:

{{ mesos.code("ex18/setup_chronos.sh-session", section="listjobs") }}

Clone the Chronos GitHub project from git@github.com:mesos/chronos.git or from https://github.com/mesos/chronos.git to access the scripts in bin/ of the project:

{{ mesos.code("ex18/setup_chronos.sh-session", section="gitclone") }}

This gets you the ``chronos-sync.rb`` script to use on your own.  To configure it you need to make a ``chronos`` directory where it stores the configurations it needs:

{{ mesos.code("ex18/setup_chronos.sh-session", section="setupsync") }}

Use the ``chronos-sync.rb`` script from the chronos project ``bin/`` directory to pull down the current Chronos tasks you've configured:

{{ mesos.code("ex18/setup_chronos.sh-session", section="runsync") }}

This will make two directories ``dependent`` and ``scheduled`` and if you look inside you'll see nothing.

To see what the format should be for these directories:

1. Make a job in the GUI and then run this ``-c`` variant of the command to get a sample.
2. Run the ``-c`` variant again and you should find a ``sleeper.yaml`` file if you named your job ``sleeper`` like I did in the video.

This is what that file looks like:

{{ mesos.code("ex18/sleeper.yaml") }}

Copy ``sleeper.yaml`` to a new file named ``scheduled/test.yaml`` and make it have this content:

{{ mesos.code("ex18/test.yaml") }}

This will run the ``date`` command every 5 minutes starting now.

This will run the ``date`` command every 5 minutes starting now.  Save that file and  run this regular variant of the sync command:

{{ mesos.code("ex18/setup_chronos.sh-session", section="runsync") }}

View the available jobs:

{{ mesos.code("ex18/setup_chronos.sh-session", section="listjobs") }}

Look on the nodes for the ``/tmp/job.log`` file to see if it's working.

Delete the ``scheduled/sleeper.yaml`` file to and use the sync tool again to remove it:

{{ mesos.code("ex18/setup_chronos.sh-session", section="deletejobs") }}

Add this to Ansible again so that it's included in the build.  These are the two lines to add to the master configuration in ``playbook.yml`` after your marathon configuration in the ``hosts: master`` section:

{{ mesos.code("ex18/playbook.yml", section="startchronos") }}

Further Study
-------------

* Read the full documentation for Chronos at https://github.com/mesos/chronos.


