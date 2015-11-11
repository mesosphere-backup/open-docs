---
layout: doc
title: Tutorials
redirect_from: 
- /tutorials/etl-pipelines-with-chronos-and-hadoop/ 
- /tutorials/mesosphere-on-a-single-coreos-instance/
- /learn/run-play-on-mesos/
- /tutorials/run-play-on-mesos/
- /learn/run-spark-on-mesos/
- /tutorials/run-spark-on-mesos/
- /learn/run-storm-on-mesos/
- /tutorials/run-storm-on-mesos/
---

<div class="body-light">
  <div id="tutorials">

    {% for row in site.data.tutorials %}
      {% assign platform=row[1] %}
      {% unless platform.hide == true %}
        <div class="learn-tutorial-service-block">
          <div class="row learn-tutorial-header">
            <div class="col-md-2">
              <i class="learn-tutorial-service-icon learn-tutorial-service-icon-{{ platform.icon }}"></i>
            </div>
            <div class="col-md-10">
              <h2 class="media-heading">
                {{ platform.name }}
              </h2>
              <p class="text-muted">{{ platform.blurb }}</p>
            </div>
          </div>
          <ul class="tutorial-list list-unstyled">
            {% for entry in platform.tutorials %}
              {% assign tutorial=entry[1] %}
              {% assign tutorial_page=nil %}
              {% assign url=tutorial.path %}
              {% for p in site.pages %}
                {% if tutorial.path == p.path %}
                  {% assign url=p.url %}
                {% endif %}
              {% endfor %}

              <li class="row media">
                <div class="col-sm-8 col-sm-offset-1">
                  <h3 class="media-heading">
                    <a href="{{ url }}">{{ tutorial.title }}</a>
                  </h3>
                  <time datetime="{{ tutorial.date }}"
                      class="text-muted learn-tutorial-timestamp">
                    <strong>{{ tutorial.date | date: "%B %-d, %Y" }}</strong>
                  </time>
                  <p>{{ tutorial.blurb }}</p>
                </div>
              </li>
            {% endfor %}
          </ul>
        </div>
      {% endunless %}
    {% endfor %}
  </div>
</div>
