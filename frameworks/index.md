---
layout: doc
title: Frameworks On Mesos
---

<div class="learn-developer-resources" id="apps">

  <div class="row learn-periodic-table-block">
    <div class="col-sm-7">
      <img class="img-responsive" src="{% asset_path learn/periodic-table-721x411.png %}"
        alt="Applications That Run on Mesos" width="721" height="411">
    </div>
    <div class="col-sm-5 learn-periodic-table-aside">
      <h2>Applications that Run on Mesos</h2>
      <p>
        Mesos makes it easy to develop distributed systems by providing
        high-level building blocks. This is a list of applications that take
        advantage of its scalability, fault-tolerance, and resource isolation.
      </p>
      <h4>Types of Applications</h4>
      <ul class="list-unstyled">
        <li class="periodic-table-legend bluepop">PaaS and long running</li>
        <li class="periodic-table-legend seafoam">Big data processing</li>
        <li class="periodic-table-legend violet">Batch scheduling</li>
        <li class="periodic-table-legend magenta">Data storage</li>
      </ul>
    </div>
  </div>


  <ul class="row learn-app-list list-unstyled">

    <li class="service-icon service-icon-marathon">
      <h4>
        <a href="https://github.com/mesosphere/marathon">Marathon</a>
      </h4>
      <p>
        Marathon is a private PaaS built on Mesos. It automatically handles
        hardware or software failures and ensures that an app is "always on".
        <a href="/tutorials/run-services-with-marathon/">
          Try a Tutorial <i class="fa fa-angle-double-right"></i>
        </a>
      </p>
    </li>

    <li class="service-icon service-icon-chronos">
      <h4>
        <a href="https://github.com/airbnb/chronos">Chronos</a>
      </h4>
      <p>
        Chronos is a distributed job scheduler that supports complex job
        topologies. It can be used as a more fault-tolerant replacement
        for Cron.
        <a href="/tutorials/run-chronos-on-mesos/">Try a Tutorial <i class="fa fa-angle-double-right"></i></a>
      </p>
    </li>

    <li class="service-icon service-icon-hadoop">
      <h4>
        <a href="http://hadoop.apache.org/">Apache Hadoop</a>
      </h4>
      <p>
        Running Hadoop on Mesos distributes MapReduce jobs efficiently
        across an entire cluster.
      </p>
    </li>

    <li class="service-icon service-icon-spark">
      <h4>
        <a href="http://spark.incubator.apache.org/">Apache Spark</a>
      </h4>
      <p>
        Spark is a fast and general-purpose cluster computing system which
        makes parallel jobs easy to write.
        <a href="/tutorials/run-spark-on-mesos/">Try a Tutorial <i class="fa fa-angle-double-right"></i></a>
      </p>
    </li>

    <li class="service-icon service-icon-storm">
      <h4>
        <a href="http://storm.incubator.apache.org/">Apache Storm</a>
      </h4>
      <p>
        Apache Storm is a distributed realtime computation system. Storm
        makes it easy to reliably process unbounded streams of data, doing
        for realtime processing what Hadoop did for batch processing.
        <a href="/tutorials/run-storm-on-mesos/">Try a Tutorial <i class="fa fa-angle-double-right"></i></a>
      </p>
    </li>

  </ul>
<ul class="row learn-app-list list-unstyled">
    <li class="service-icon service-icon-aurora">
      <h4>
        <a href="https://aurora.apache.org/">Apache Aurora</a>
      </h4>
      <p>
        Apache Aurora is a service scheduler that runs on top of Mesos,
        enabling you to run long-running services that take advantage of
        Mesos' scalability, fault-tolerance, and resource isolation.
      </p>
    </li>

    <li class="service-icon service-icon-sssp">
      <h4>
        <a href="https://github.com/mesosphere/sssp">SSSP</a>
      </h4>
      <p>
        SSSP is a simple web application that provides a white-label
        "Megaupload" for storing and sharing files in S3.
        <a href="https://mesosphere.com/blog/2014/01/29/megaupload-on-mesos/">
          Try a Tutorial <i class="fa fa-angle-double-right"></i>
        </a>
      </p>
    </li>

    <li class="service-icon service-icon-cray">
      <h4>
        <a href="https://github.com/nqn/mesos-chapel">Cray Chapel</a>
      </h4>
      <p>
        Cray Chapel is a productive parallel programming language. The
        Chapel Mesos scheduler lets you run Chapel programs on Mesos.
      </p>
    </li>

    <li class="service-icon service-icon-exelixi">
      <h4>
        <a href="https://github.com/mesosphere/exelixi">Exelixi</a>
      </h4>
      <p>
        Exelixi is a distributed framework for running genetic algorithms
        at scale.
      </p>
    </li>

    <li class="service-icon service-icon-dpark">
      <h4>
        <a href="https://github.com/douban/dpark">Dpark</a>
      </h4>
      <p>
        Python clone of Spark, a MapReduce-like framework written in Python,
         running on Mesos.
      </p>
    </li>

    <li class="service-icon service-icon-hydra">
      <h4>
        <a href="https://github.com/mesosphere/mesos-hydra">MPI</a>
      </h4>
      <p>
        Message Passing Interface (MPI) is a message-passing system designed
         to function on a wide variety of parallel computers.
      </p>
    </li>

    <li class="service-icon service-icon-jenkins">
      <h4>
        <a href="https://wiki.jenkins-ci.org/display/JENKINS/Mesos+Plugin">Jenkins</a>
      </h4>
      <p>
        Jenkins is a continuous integration server. The mesos-jenkins
        plugin allows it to dynamically launch workers on a Mesos cluster
        depending on the workload.
        <a href="https://github.com/jenkinsci/mesos-plugin">Learn more <i class="fa fa-angle-double-right"></i></a>
      </p>
    </li>

    <li class="service-icon service-icon-cassandra">
      <h4>
        <a href="https://cassandra.apache.org/">Apache Cassandra</a>
      </h4>
      <p>
        The Apache Cassandra database is the right choice when you need
        scalability and high availability without compromising performance.
        Linear scalability and proven fault-tolerance on commodity hardware
        or cloud infrastructure make it the perfect platform for
        mission-critical data.
        <a href="https://docs.mesosphere.com/services/cassandra/">Learn more <i class="fa fa-angle-double-right"></i></a>
      </p>
    </li>

    <li class="service-icon service-icon-hypertable">
      <h4>
        <a href="https://code.google.com/p/hypertable/wiki/Mesos">Hypertable</a>
      </h4>
      <p>
        Hypertable is a high performance, scalable, distributed storage and
        processing system for structured and unstructured data.
      </p>
    </li>

    <li class="service-icon service-icon-concord">
      <h4>
        <a href="http://docs.concord.io/">Concord</a>
      </h4>
      <p>
        Concord is a real-time distributed stream processing framework. Concord empowers developers to process and react to their data in real-time, whether they're building real-time fraud detection, recommendation engine, ad targeting, or algorithmic trading systems. Concord is a native framework on Mesos built in C++ with RocksDB, Folly, and Apache Thrift.
      </p>
    </li>
  </ul>
  <hr>

</div>
