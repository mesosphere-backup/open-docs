---
layout: default
title: Download Apache Mesos Packages
base: //downloads.mesosphere.io/master
---

<div class="page-header">
  <h1>Download Apache Mesos Packages</h1>
</div>

<em>
This page contains information about Apache Mesos release builds. For release candidate builds, see the [mesos-rc](/downloads/mesos-rc/) page. For nightly builds, see the [mesos-nightly](/downloads/mesos-nightly/) page.

See <a href="#installation">below</a> for installation instruction.
</em>

### All releases

{% for package in site.data.download_versions %}
{% if package.name == "mesos" %}
{% assign releases = package.releases | sort:"name" | reverse%}
{% for rel in releases %}
<h4>
  <a href="#apache-mesos-{{ rel.name }}" title="Show packages for Apache Mesos {{ rel.name }}">Apache Mesos {{ rel.name }}</a>&nbsp;&nbsp;&nbsp;
  <small>released
    <time datetime="{{ rel.timestamp | date_to_xmlschema }}">{{ rel.timestamp | date_to_string }}</time>
  </small>
</h4>
{% endfor %}
{% endif %}
{% endfor %}

{% for package in site.data.download_versions %}
{% if package.name == "mesos" %}
{% assign releases = package.releases | sort:"name" | reverse%}
{% for rel in releases %}
<div id="apache-mesos-{{ rel.release_group }}"></div>
<table class="table table-striped" id="apache-mesos-{{ rel.name }}">
  <thead>
    <tr>
      <th valign="bottom" align="left">
        <span class="h4">Apache Mesos {{ rel.name }}</span>
        <small style="font-weight:normal;">
          <a href="{{ rel.announcement }}" title="Release notes for Apache Mesos {{ rel.name }}">Release notes</a>
        </small>
      </th>
      <th class="text-right">
        <span title="Release date for Apache Mesos {{ rel.name }}" style="font-weight:normal;">
          <time datetime="{{ rel.timestamp | date_to_xmlschema }}">{{ rel.timestamp | date_to_string  }}</time>
        </span>
      </th>
    </tr>
  </thead>
  <tbody>

  {% for pkg in rel.packages %}
  <tr>
    <td style="vertical-align:middle;">Apache Mesos {{rel.name}} for
      <a href="http://repos.mesosphere.com/{{ pkg.path }}" title="Apache Mesos {{rel.name}} for {{pkg.name}}">{{pkg.name}}</a>
    </td>
    <td align="right">
      {% if pkg.sha256 %}
        {% assign sha = "SHA 256" %}
        {% assign sha_val = pkg.sha256 %}
      {% else %}
        {% assign sha = "SHA" %}
        {% assign sha_val = pkg.sha %}
      {% endif %}
      <button class="btn btn-link" data-toggle="collapse" data-target="#{{ sha_val }}" aria-expanded="false" aria-controls="{{ sha_val }}">
        {{ sha }}
      </button>
      <div class="collapse" id="{{ sha_val }}">
        <small style="font-family:monospace"> {{ sha_val }} </small>
      </div>
    </td>
  </tr>
  {% endfor %}
  </tbody>
</table>
{% endfor %}
{% endif %}
{% endfor %}

---
<div id="installation"></div>
## Installing Mesos packages

Mesosphere has official package repositories which connect directly to the native package management tools of your favorite Linux distribution — namely apt-get and yum — to install Mesos on top of the most common Linux distributions (RedHat, CentOS, Ubuntu and Debian).

###Supported Distributions

+ Ubuntu 16.10 (yakkety)
+ Ubuntu 16.04 (xenial)
+ Ubuntu 14.04 (trusty)
+ Ubuntu 12.04 (precise)
+ Debian 9 (stretch)
+ Debian 8 (jessie)
+ Enterprise Linux 7 (RedHat/CentOS)
+ Enterprise Linux 6 (RedHat/CentOS)

### Setup Repositories

#### Debian / Ubuntu

```sh
# Setup
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv E56151BF
DISTRO=$(lsb_release -is | tr '[:upper:]' '[:lower:]')
CODENAME=$(lsb_release -cs)

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
sudo yum -y install --enablerepo=mesosphere mesos
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
