---
layout: default
title: Download Apache Mesos Nightly Packages
base: //downloads.mesosphere.io/master
---

<div class="page-header">
  <h1>Download Apache Mesos Nightly Build Packages</h1>
</div>

<em>
This page contains information about acquiring nightly builds for Apache Mesos. For official releases, see the [releases](/downloads/mesos/) page. For release candidate builds, see the [mesos-rc](/downloads/mesos-rc/) page.
</em>

Mesosphere has official package repositories which connect directly to the native package management tools of your favorite Linux distribution — namely apt-get and yum — to install Mesos on top of the most common Linux distributions (RedHat, CentOS, Ubuntu and Debian).

###Supported Distributions

+ Ubuntu 15.10 (willy)
+ Ubuntu 15.04 (vivid)
+ Ubuntu 14.04 (trusty)
+ Ubuntu 12.04 (precise)
+ Debian 8 (jessie)
+ Enterprise Linux 7 (RedHat/CentOS)
+ Enterprise Linux 6 (RedHat/CentOS)

### Setup Repositories

#### Debian / Ubuntu

```sh
# Setup
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv E56151BF
DISTRO=$(lsb_release -is | tr '[:upper:]' '[:lower:]')
CODENAME=$(lsb_release -cs)-unstable

# Add the repository
echo "deb http://repos.mesosphere.com/${DISTRO} ${CODENAME} main" | \
  sudo tee /etc/apt/sources.list.d/mesosphere.list
sudo apt-get -y update
```

#### RedHat 6 / CentOS 6

```sh
# Add the repository
sudo rpm -Uvh http://repos.mesosphere.com/el/6/noarch/RPMS/mesosphere-el-repo-6-3.noarch.rpm
```

#### RedHat 7 / CentOS 7

```sh
# Add the repository
sudo rpm -Uvh http://repos.mesosphere.com/el/7/noarch/RPMS/mesosphere-el-repo-7-3.noarch.rpm
```

### Install from package

The most recent package for your distribution can be installed from the Mesosphere repositories using the following commands:

#### Debian / Ubuntu:

```sh
sudo apt-get -y install mesos
```

#### RedHat / CentOS:

```sh
sudo yum  -y install --enable-repo=mesosphere-unstable mesos
```

---

### The Source
Apache Mesos is an open source project, and its source is available from the
[Mesos Downloads ➦](https://mesos.apache.org/downloads/) page.

### Installation Tips

* On many systems, you'll need to ensure `libjvm.so` is on the linker path so
  that Mesos can find it when it starts. If you have only one JVM installed in
  the default location, one can approach the problem with a
  [small shell script](https://gist.github.com/solidsnack/7569266).
  If you have a better idea about how to do this, please contact
  `support@mesosphere.io` and we'll try to implement it.

* Configure Mesos to talk to Zookeeper by overwriting `/etc/mesos/zk`.

* Mesos loads many configuration settings via environment variables, which can
  be set in `/etc/defaults/mesos`, `/etc/defaults/mesos-master` and
  `/etc/defaults/mesos-slave`.
