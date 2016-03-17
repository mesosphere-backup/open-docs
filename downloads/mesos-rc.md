---
layout: default
title: Download Apache Mesos RC Packages
base: //downloads.mesosphere.io/master
---

<div class="page-header">
  <h1>Download Apache Mesos RC Packages</h1>
</div>

<em>
This page contains information about Apache Mesos release candidate (RC) builds. For official releases, see the [releases](/downloads/mesos/) page.
</em>

### All Release Candidates

{% for package in site.data.download_rc_versions %}
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

{% for package in site.data.download_rc_versions %}
{% if package.name == "mesos" %}
{% assign releases = package.releases | sort:"name" | reverse%}
{% for rel in releases %}
<div id="apache-mesos-{{ rel.release_group }}"></div>
<table class="table table-striped" id="apache-mesos-{{ rel.name }}">
  <thead>
    <tr>
      <th valign="bottom" align="left">
        <span class="h4">Apache Mesos {{ rel.name | upcase }}</span>
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
