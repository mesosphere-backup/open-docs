---
layout: default
title: Download Apache Mesos Packages
base: //downloads.mesosphere.io/master
---

<div class="page-header">
  <h1>Download Apache Mesos Packages</h1>
</div>

### All releases

{% for package in site.data.download_versions %}
{% if package.name == "mesos" %}
{% for rel in package.releases %}
<h4>
  <a href="#apache-mesos-{{ rel.name }}" title="Show packages for Apache Mesos Apache Mesos {{ rel.name }}">Apache Mesos {{ rel.name }}</a>&nbsp;&nbsp;&nbsp;
  <small>released
    <time datetime="{{ rel.timestamp | date_to_xmlschema }}">{{ rel.timestamp | date_to_string }}</time>
  </small>
</h4>
{% endfor %}
{% endif %}
{% endfor %}

{% for package in site.data.download_versions %}
{% if package.name == "mesos" %}
{% for rel in package.releases %}
<div id="apache-mesos-{{ rel.release_group }}"></div>
<table class="table table-striped" id="apache-mesos-{{ rel.name }}">
  <thead>
    <tr>
      <th valign="bottom" align="left">
        <span class="h4">Apache Mesos {{ rel.name }}</span>
        <small style="font-weight:normal;">
          <a href="{{ rel.announcement }}" title="Release announcement for Apache Mesos {{ rel.name }}">Release announcement</a>
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
    <td>Apache Mesos {{rel.name}} for
      <a href="http:{{ page.base }}/{{ pkg.path }}" title="Apache Mesos {{rel.name}} for {{pkg.name}}">{{pkg.name}}</a>
      and <a href="http:{{ page.base }}/{{ pkg.egg_path }}" title="Apache Mesos Python Egg {{rel.name}} for {{pkg.name}}">Python egg</a>
    </td>
    <td align="right">
      <a href="http:{{ page.base }}/{{ pkg.path }}.sha256" title="SHA 256 for Apache Mesos {{rel.name}} for {{pkg.name}}">SHA 256</a>
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
