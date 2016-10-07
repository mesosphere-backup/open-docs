---
layout: doc
title: Mesos Slave Configuration
redirect_to:
- https://dcos.io/
---

## Introduction

The centerpiece of Mesosphere is Apache Mesos.  Mesos installs with two different components, the master and the slave.  The slave is a process which runs on a node in the cluster and offers up resources available on that node to the Mesos Master.  The slave also takes schedule requests from the master and invokes an executor to launch a task.  It is expected that only one slave is running a node.  Nodes in this context can be physical machines or virtual machines.   Details for installing a slave differs by environment and can be found in our [getting started](/getting-started) section.


The Mesos slave can take a variety of configuration options through command-line arguments or environment variables. A list of the available options can be seen by running `mesos-slave --help`. Each option can be set in two ways. Using an example flag of `--master`, the following are the available ways to set this option:

* By passing on the command line to the binary: `mesos-slave --master=localhost:5050`
* By setting the environment variable: `export MESOS_MASTER=localhost:5050`

<div class="alert alert-info">
<strong>Note:</strong>
Configuration values are searched for first in the environment, then on the command-line.
</div>
<div class="alert alert-info">
<strong>Note:</strong>
The environment variable flag is created by uppercasing the flag with a prefix of MESOS_.  So master equals MESOS_MASTER.
</div>

The startup initialization script `/usr/bin/mesos-init-wrapper` provides a few more configuration points for these options.

* The file `/etc/default/mesos` may contain a flag = value on multiple lines and will be used for the master and the slave.
* The file `/etc/default/mesos-slave` may contain the flag = value on multiple lines
* A file named the same name as the flag may be placed in the `/etc/mesos-slave` directory. So a `/etc/mesos-slave/hostname` file containing the value of `10.141.141.10` is like running the slave with the option `--hostname=10.141.141.10`

Additionally the ZooKeeper value may be configured in the `/etc/mesos/zk` file.

When using the init script `/usr/bin/mesos-init-wrapper`, there are a few additional environment variables allowed:

* ULIMIT - The value sets the ulimit of the process
* MASTER - The value sets the --master flag
* IP -	The value sets the --ip flag
* LOGS - The value sets the --log_dir flag
* ISOLATION - The value sets the --isolation flag

The Mesos slave's minimum launch configuration is to know how to discover the master, such as: `/usr/local/sbin/mesos-slave --master=localhost:5050`


<!--
	Todo:  need details here...
For the init script it is also possible to add files to `/etc/default/mesos-slave` or `/etc/mesos-slave'.
* Add a file named after the option, containing the value in the `/etc/mesos-slave`.  In our example `/etc/mesos-slave/master` file would contain the value of localhost:5050
 -->

***
## Configurations

<table class="table table-striped">
	<thead>
		<tr>
			<th> flag        </th>
			<th> explanation            </th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td> <a name="attributes">attributes</a> </td>
			<td>
				 <code>--attributes=rack:2</code> or <code>--attributes="rack:2,U:1"</code>.  This would be a way of indicating that this node is in rack 2 and is U 1.  The attributes are arbitrary and can be thought of as ways of tagging a node.   By default there are no attributes.<!-- need details on leveraging this -->
			</td>
		</tr>
		<tr>
			<td> <a name="checkpoint">checkpoint</a> </td>
			<td>
				The options are <code>--checkpoint</code> or <code>--no-checkpoint</code>.  <code>--checkpoint</code> is true by default.  When true,
				the slave and its frameworks information will have checkpoints recorded to disk.  This enables
				the slaves ability to recover status updates in the event of a bounced slave process.  It works
				in combination with <code>--recover</code>.
			</td>
		</tr>
		<tr>
		  <td> <a name="containerizer_path">containerizer_path</a> </td>
		  <td>
		    When using an external <a href="/reference/glossary/#containerizer">containerizer</a>, the containerizer path flag, <code>--isolation=external</code>, must be set to the location of the external containerizer executable.
		  </td>
		</tr>
		<tr>
		  <td> <a name="credential">credential</a> </td>
		  <td>
		    Path to a file containing a single line with the 'principal' and 'secret' separated by whitespace.
		    The secret is clear text in the file.  An example of create a credential file is: <code>echo "mesos rocks" > /etc/mesos-slave/passwd</code>.  Examples of using the credential flag: <code>--credential=/etc/mesos-slave/passwd</code>.  The credentials are the username and password used to access a secured Mesos master.
		  </td>
		</tr>
		<tr>
		  <td> <a name="default_container_image">default_container_image</a> </td>
		  <td>
		     The default container image to use if not specified by a task, when using external containerizer.
		     To use this flag you need to set <code>--isolation=external</code> and you must have a value for <code>--containerizer_path</code>. For example:<br>
		     <code>--default_container_image<wbr>=docker:///libmesos/ubuntu:13.10</code>
		  </td>
		</tr>
		<tr>
		  <td> <a name="default_role">default_role</a> </td>
		  <td>
		    Resources, for example, CPU, can be constrained by roles.  The <code>--resources</code> flag allows control over resources (for example: <code>cpu(prod):3</code>, which reserves 3 CPU for the <code>prod</code> role).  If a resource is detected but is **not** specified in the resources flag, then it will be assigned this default_role.  The default value allows all roles to have access to this resource.  For example: <code>--default_role=prod</code>
		  </td>
		</tr>
		<tr>
		  <td> <a name="disk_watch_interval">disk_watch_interval</a> </td>
		  <td>
		    Periodic time interval to check the disk usage (default: 1mins).  For example: <code>--disk_watch_interval=10secs</code>
		  </td>
		</tr>
		<tr>
		  <td> <a name="executor_registration_timeout">executor_registration_timeout</a> </td>
		  <td>
		    Amount of time to wait for an executor to register with the slave before considering it hung and shutting it down (default: 1mins). For example: <code>--executor_registration_timeout<wbr>=60secs</code>
		  </td>
		</tr>
		<tr>
		  <td> <a name="executor_shutdown_grace_period">executor_shutdown<wbr>_grace_period</a> </td>
		  <td>
		    Amount of time to wait for an executor to shut down (default: 5secs) For example: <code>--executor_shutdown_grace_period<wbr>=60secs</code> <!-- would love to know more.. need consequence  -->
		  </td>
		</tr>

		<tr>
		  <td> <a name="frameworks_home">frameworks_home</a> </td>
		  <td>
		    Directory prepended to relative executor URIs <!-- would love to know more.. need consequence  -->
		  </td>
		</tr>
		<tr>
		  <td> <a name="gc_delay">gc_delay</a> </td>
		  <td>
		    Maximum amount of time to wait before cleaning up executor directories.
            Note that this delay may be shorter depending on the available disk usage. (default: 1weeks)
            For example: <code>--gc_delay=3days</code>  <!-- more detail on disk usage -->
		  </td>
		</tr>
		<tr>
		  <td> <a name="hadoop_home">hadoop_home</a> </td>
		  <td>
		    Path to specify <code>HADOOP_HOME</code> (for fetching framework executors from HDFS)
		    (no default, look for <code>HADOOP_HOME</code> in environment or find hadoop on PATH)
		  </td>
		</tr>
		<tr>
		  <td> <a name="help">help</a> </td>
		  <td>
		    The options are <code>--help</code> or <code>--no-help</code>.  The default is <code>--no-help</code>.  When <code>--help</code> is specified, it prints out the help message.
		  </td>
		</tr>
		<tr>
		  <td> <a name="hostname">hostname</a> </td>
		  <td>
		    The hostname the slave should report.  If left unset, system hostname will be used (recommended).
		    --hostname=unicorn
		  </td>
		</tr>
		<tr>
		  <td> <a name="ip">ip</a> </td>
		  <td>
		    IP address to listen on.  This can be important on multi-NIC environments. <code>--ip=10.0.0.100</code>
		  </td>
		</tr>

		<tr>
		  <td> <a name="isolation">isolation</a> </td>
		  <td>
		    There are a number of types of isolators for each type of resource which can be different from platform to platform.  A linux platform has cgroups which can provide CPU and memory isolation.  This flag always for the configuration of a set of isolations the slave will use. (default: posix/cpu,posix/mem).  For example: <code>--isolation=cgroups/cpu,cgroups/mem</code>
		            <!-- list of options -->
		  </td>
		</tr>
		<tr>
		  <td> <a name="launcher_dir">launcher_dir</a> </td>
		  <td>
		    Location of Mesos binaries.  The default is platform dependent.  On Ubuntu the default is <code>/usr/local/libexec/mesos</code>.
		    <!-- value of this?? -->
		  </td>
		</tr>
		<tr>
		  <td> <a name="log_dir">log_dir</a> </td>
		  <td>
		     Path to write log files.  There is no default.  When there is no setting (default), nothing is written to disk.  <code>--log_dir=/var/log/mesos</code>
		  </td>
		</tr>
		<tr>
		  <td> <a name="logbufsecs">logbufsecs</a> </td>
		  <td>
		     How many seconds to buffer log messages for (default: 0) <code>--logbufsecs=10</code>
		     <!-- value? consequence? -->
		  </td>
		</tr>
		<tr>
		  <td> <a name="logging_level">logging_level</a> </td>
		  <td>
		     Log message at or above this level; possible values:  'INFO', 'WARNING', 'ERROR'.  (default: INFO). For example: <code>--logging_level=WARNING</code>
		  </td>
		</tr>
		<tr>
		  <td> <a name="master">master</a> </td>
		  <td>
		     This specifies how to connect to a master or a quorum of masters.  This flag works with 3 different techniques.  It may be one of:
		     <ol>
		      <li>hostname or ip to a master or comma-delimited list of masters</li>
		      <li>zookeeper or quorum hostname/ip + port + master registration path </li>
		      <li>a path to a file containing either one of the above options </li>
		     </ol>

		     ***
		     <h4>Examples</h4>

		     <p>Host:</p>
		     <code>--master=localhost:5050</code><br/>
		     <code>--master=10.0.0.5:5050,10.0.0.6:5050</code>

		     ***
		     <p>ZooKeepers:</p>
		     <code>--master=zk://10.0.0.5:2181/mesos,<wbr>zk://10.0.0.6:2181/mesos</code><br/>
		     <code>--master=zk://username:password<wbr>@10.0.0.5:2181/mesos</code>

		     ***
		     <p>File:</p>
		     <code>--master=/etc/mesos/zk</code>
		  </td>
		</tr>
		<tr>
		  <td> <a name="port">port</a> </td>
		  <td>
		     The port the slave will listen on. (default: 5051)  For example: <code>--port=5052</code>
		  </td>
		</tr>
		<tr>
		  <td> <a name="quiet">quiet</a> </td>
		  <td>
		    The options are <code>--quiet</code> or <code>--no-quiet</code>. Quiet disables logging to stderr. (default: false or <code>--no-quiet</code>).
		  </td>
		</tr>
	    <tr>
	      <td> <a name="recover">recover</a> </td>
	      <td>
	        The recover is only useful if <code>--checkpoint</code> is true, which is the default.  If <code>--no-checkpoint</code> is true, then no recovery is performed and the slave registers with the master as a new slave.

	        Valid options for <code>--recover</code> are limited to: <code>reconnect</code> and <code>cleanup</code>.
	        The default is reconnect, which means that a recycled or recovering slave will reconnect with old live executors.  When in cleanup, a bounce of the slave process will kill any old live executors.

	<!--
	        need more information this... I don't completely understand!! - 1) kill and exit? the slave exits?
	        2) all events that cause this
	               cleanup  : Kill any old live executors and exit
	               Use this option when doing an incompatible slave
	               or executor upgrade!).                                              -->
	      </td>
	    </tr>
	    <tr>
	      <td> <a name="recovery_timeout">recovery_timeout</a> </td>
	      <td>
	        Amount of time allocated for the slave to recover. If the slave takes longer than recovery_timeout to recover, any executors that are waiting to reconnect to the slave will self-terminate.
	        NOTE: This flag is only applicable when checkpoint is enabled.  (default: 15mins)
	        For example: <code>--recovery_timeout=10mins</code>
	      </td>
	    </tr>
	    <tr>
	      <td> <a name="registration_backoff_factor">registration_backoff_factor</a> </td>
	      <td>
	        The slave initially picks a random amount of time between [0, b], where b = registration_backoff_factor, to (re-)register with a new master. Subsequent retries are exponentially backed off based on this interval (e.g., 1st retry uses a random value between [0, b * 2^1], 2nd retry between [0, b * 2^2], 3rd retry between [0, b * 2^3] etc)  up to a maximum of 1mins (default: 1secs)
	        <!-- can this be less than 1secs? what happens at 1mins? -->
	      </td>
	    </tr>
	    <tr>
	      <td> <a name="resource_monitoring_interval">resource_monitoring_interval</a> </td>
	      <td>
	        Periodic time interval for monitoring executor resource usage (e.g., 10secs, 1min, etc)
	        (default: 1secs) For example: <code>--resource_monitoring_interval=10secs</code>
	      </td>
	    </tr>
	    <tr>
	      <td> <a name="resources">resources</a> </td>
	      <td>
	        Total consumable resources per slave, in the form 'name(role):value;name(role):value...'. This value can be set to limit resources per role, or to overstate the number of resources that are available to the slave.
	        <code>--resources="cpus(*):8; mem(*):15360; disk(*):710534; ports(*):[31000-32000]"</code><br/>
	        <code>--resources="cpus(prod):8; cpus(stage):2 mem(*):15360; disk(*):710534; ports(*):[31000-32000]"</code><br/>

	        All * roles will be detected, so you can specify only the resources that are not all roles (*).
	        <code>--resources="cpus(prod):8; cpus(stage)"</code>

	      </td>
	    </tr>
	    <tr>
	      <td> <a name="strict">strict</a> </td>
	      <td>
	        The options are <code>--strict</code> or <code>--no-strict</code>.  If <code>--strict</code> is true, any and all recovery errors are considered fatal. If <code>--no-strict</code>, any expected errors (e.g., slave cannot recover information about an executor, because the slave died right before the executor registered) during recovery are ignored and as much state as possible is recovered.  The default is <code>--strict</code>.
	        <!-- more details -->
	      </td>
	    </tr>
	    <tr>
	      <td> <a name="switch_user">switch_user</a> </td>
	      <td>
	        The options are <code>--switch_user</code> or <code>--no-switch_user</code>.  Whether to run tasks as the user who submitted them rather than the user running the slave (requires setuid permission). The default is <code>--switch_user</code>.
	      </td>
	    </tr>
	    <tr>
	      <td> <a name="version">version</a> </td>
	      <td>
	        The options are <code>--version</code> or <code>--no-version</code>.  Show version and exit. The default is <code>--no_version</code>.
	      </td>
	    </tr>
	    <tr>
	      <td> <a name="work_dir">work_dir</a> </td>
	      <td>
	        Path to write framework work directories and replication logs. (default: <code>/tmp/mesos</code>)
	      </td>
	    </tr>
	</tbody>
</table>

****

### Example Configuration

The following details the slave configuration of a Mesos installation in [playa-mesos](https://github.com/mesosphere/playa-mesos), which is a single node Mesos cluster running in a virtual machine.

* The slave starts up with an init script in /etc/init/, the full path is `/etc/init/mesos-slave.conf`.  This file executes `/usr/bin/mesos-init-wrapper` in a slave mode.
* The file `/etc/default/mesos` is used to set the log directory.
* The file `/etc/default/mesos-slave` sets the master to the value in `/etc/mesos/zk`.
* The file `/etc/mesos/zk` provides the zookeeper and a way to discover the master which is: `zk://localhost:2181/mesos`.
* The file `/etc/mesos-slave/hostname` provides the ip of the vm.





