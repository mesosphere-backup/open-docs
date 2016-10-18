---
layout: doc
title: Mesos Master Configuration
redirect_to:
- https://dcos.io/
---

## Introduction

The centerpiece of Mesosphere is Apache Mesos.  Mesos installs with two different components, the master and the slave.  The master is a process which runs on a node in the cluster and orchestrates the running of tasks on slaves by receiving resource offers from slaves and offering those resources to registered frameworks, such as Mesosphere Marathon.  It is expected that in High Availability (HA) mode, there are 3 or more masters running each on a separate node.  Nodes in this context can be physical machines or virtual machines.   Details for installing a master differs by environment and can be found in our [getting started](/getting-started) section.

The Mesos master can take a variety of configuration options through command-line arguments, or environment variables. A list of the available options can be seen by running `mesos-master --help`. Each option can be set in two ways. Using an example flag of `--port`, the following are the available ways to set this option:

* By passing on the command line to the binary: `mesos-master --port=5150`
* By setting the environment variable: `export MESOS_PORT=5150`

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
* The file `/etc/default/mesos-master` may contain the flag = value on multiple lines
* A file named the same name as the flag may be placed in the `/etc/mesos-master` directory. So a `/etc/mesos-master/hostname` file containing the value of `10.141.141.10` is like running the master with the option `--hostname=10.141.141.10`

Additionally the ZooKeeper value may be configured in the `/etc/mesos/zk` file.

When using the init script `/usr/bin/mesos-init-wrapper`, there are a few additional environment variables allowed:

* ULIMIT - The value sets the ulimit of the process
* ZK - The value sets the --zk flag
* IP -	The value sets the --ip flag
* PORT - The value sets the --port flag
* Cluster - The value sets the --cluster flag
* LOGS - The value sets the --log_dir flag

****

<div class="alert alert-info">
<strong>Note:</strong>
When time is a unit of measure with a flag, the possible options are (ns, us, ms, secs, mins, hrs, days, weeks), where ns=nanoseconds, us=microseconds, ms=milliseconds, secs=seconds, mins=minutes, hrs=hours, days=days, and weeks=weeks.

</div>


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
			<th width=20%> flag        </th>
			<th> explanation            </th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td> <a name="allocation_interval">allocation_interval</a> </td>
			<td>
				Amount of time to wait between performing batch allocations (e.g., 500ms, 1sec, etc).
				(default: 1secs) ex. <code>--allocation_interval=500ms</code>
				<!-- need to understand the impact of this -->
			</td>
		</tr>
		<tr>
			<td> <a name="authenticate">authenticate</a> </td>
			<td>
				The options are --authenticate or --no-authenticate.  If --authenticate is 'true' only authenticated frameworks are allowed to register. If --no-authenticate is present unauthenticated frameworks are also allowed to register. (default: --no-authenticate)
				If --authenticate is true, it is necessary for the master to also be configured with the --credential flag (details below).
			</td>
		</tr>
		<tr>
			<td> <a name="authenticate_slaves">authenticate_slaves</a> </td>
			<td>
				The options are --authenticate_slaves or --no-authenticate_slaves.  If --authenticate_slaves is 'true' only authenticated slaves are allowed to register. If --no-authenticate_slaves unauthenticated slaves are also allowed to register. (default: --no-authenticate_slaves)
				If --authenticate_slaves is true, it is necessary for the master to also be configured with the --credential flag (details below).
			</td>
		</tr>
		<tr>
			<td> <a name="cluster">cluster</a> </td>
			<td>
				Human readable name for the cluster, displayed in the webui.  ex. <code>--cluster=prod</code>
				<!-- what happens if master have different cluster values -->
			</td>
		</tr>
		<tr>
			<td> <a name="credential">credentials</a> </td>
			<td>
				Path to a file containing a single line with the 'principal' and 'secret' separated by whitespace.
				The secret is clear text in the file.  An example of create a credential file is: <code>echo "mesos rocks" > /etc/mesos-master/passwd</code>.  Examples of using the credential flag : <code>--credential=/etc/mesos-master/passwd</code>.  The credentials are the username and password that must be provided by frameworks and/or slaves in order to access a secured mesos master.  This value must be set if <code>--authenticate</code> or <code>--authenticate_slaves</code> is used.
			</td>
		</tr>
		<tr>
			<td> <a name="framework_sorter">framework_sorter</a> </td>
			<td>
				Policy to use for allocating resources between a given user's frameworks. Options
				are the same as for user_allocator. (default: drf)
				ex. <code>--framework_sorter=drf</code>
				<!-- there is no user_allocator and what are the options besides drf? -->
			</td>
		</tr>
		<tr>
			<td> <a name="help">help</a> </td>
			<td>
				The options are --help or --no-help.  The default is --no-help.  When --help is specified, it prints out the help message.
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
			<td> <a name="log_auto_initialize">log_auto_initialize</a> </td>
			<td>
				The options are --log_auto_initialize or --no-log_auto_initialize.
				Whether to automatically initialize the replicated log used for the registry.
				If this is set to --no-log_auto_initialize, the log has to be manually
				initialized when used for the very first time. (default: --log_auto_initialize)
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
				 Log message at or above this level; possible values:  'INFO', 'WARNING', 'ERROR'.  (default: INFO) ex. <code>--logging_level=WARNING</code>
			</td>
		</tr>
		<tr>
			<td> <a name="port">port</a> </td>
			<td>
				 The port the slave will listen on. (default: 5051)  ex. <code>--port=5052</code>
			</td>
		</tr>
		<tr>
			<td> <a name="quiet">quiet</a> </td>
			<td>
				The options are --quiet or --no-quiet. Quiet disables logging to stderr. (default: false or --no-quiet).
			</td>
		</tr>
		<tr>
			<td> <a name="quorum">quorum</a> </td>
			<td>
				The size of the quorum of replicas when using 'replicated_log' based registry. It is imperative to set this value to be a majority of masters i.e., quorum > (number of masters)/2.
				ex. <code>--quorum=2</code> <br/>
				This number represents the minumim number of master that agree with what is written next in the replicate_log.

			</td>
		</tr>
		<tr>
			<td> <a name="recovery_slave_removal_limit">recovery_slave_removal_limit</a> </td>
			<td>
				For fail-overs, limit on the percentage of slaves that can be removed from the registry *and* shutdown after the re-registration timeout elapses. If the limit is exceeded, the master will fail over rather than remove the slaves.
				This can be used to provide safety guarantees for production environments. Production environments may expect that across Master fail-overs, at most a certain percentage of slaves will fail permanently (e.g. due to rack-level failures).
				Setting this limit would ensure that a human needs to get involved if an unexpected widespread failure of slaves occurs in the cluster. Values: [0%-100%] (default: 100%)
				ex. <code>--recovery_slave_removal_limit=50%</code>
			</td>
		</tr>
		<tr>
			<td> <a name="registry">registry</a> </td>
			<td>
				Persistence strategy for the registry. Available options are 'replicated_log', 'in_memory'. (default: replicated_log). ex. <code>--registry=in_memory</code>
			</td>
		</tr>
		<tr>
			<td> <a name="registry_fetch_timeout">registry_fetch_timeout</a> </td>
			<td>
				Duration of time to wait in order to fetch data from the registry
				after which the operation is considered a failure. (default: 1mins)
				<code>--registry_fetch_timeout=5mins</code>
			</td>
		</tr>
		<tr>
			<td> <a name="resource_monitoring_interval">resource_monitoring_interval</a> </td>
			<td>
				Periodic time interval for monitoring executor resource usage (e.g., 10secs, 1min, etc)
				(default: 1secs) ex. <code>--resource_monitoring_interval=10secs</code>
			</td>
		</tr>
		<tr>
			<td> <a name="registry_store_timeout">registry_store_timeout</a> </td>
			<td>
				 Duration of time to wait in order to store data in the registry after which the operation is considered a failure. (default: 5secs)
				<code>--registry_store_timeout=1mins</code>
				<!-- more detail here -->
			</td>
		</tr>
		<tr>
			<td> <a name="registry_strict">registry_strict</a> </td>
			<td>
				The options are --registry_strict or --no-registry_strict.  If --no-registry_strict, the Registrar will never reject the admission, readmission, or removal of a slave. Consequently, 'false' can be used to bootstrap the persistent state on a running cluster.

				NOTE: This flag is *experimental* and should not be used in production yet. (default: --no-registry_strict)
			</td>
		</tr>
		<tr>
			<td> <a name="roles">roles</a> </td>
			<td>
				 A comma separated list of the allocation roles that frameworks in this cluster may belong to.
				 ex. <code>--roles="prod,stage"</code>
			</td>
		</tr>
		<tr>
			<td> <a name="root_submissions">root_submissions</a> </td>
			<td>
				The options are --root_submissions or --no-root_submissions.  --root_submissions means that root can submit frameworks.  (default: --root_submissions)
			</td>
		</tr>
		<tr>
			<td> <a name="slave_reregister_timeout">slave_reregister_timeout</a> </td>
			<td>
				The timeout within which all slaves are expected to re-register when a new master is elected as the leader. Slaves that do not re-register within the timeout will be removed from the registry and will be shut down if they attempt to communicate with master.
				NOTE: This value has to be at least 10mins. (default: 10mins)
				ex. <code>--slave_reregister_timeout=5mins</code>
			</td>
		</tr>
		<tr>
			<td> <a name="user_sorter">user_sorter</a> </td>
			<td>
				Policy to use for allocating resources between users. May be one of:
				dominant_resource_fairness (drf) (default: drf)
				ex. <code>--user_sorter=drf</code>
				<!-- need options -->
			</td>
		</tr>
		<tr>
			<td> <a name="version">version</a> </td>
			<td>
				The options are --version or --no-version.  Show version and exit. The default is --no_version.
			</td>
		</tr>
		<tr>
			<td> <a name="webui_dir">webui_dir</a> </td>
			<td>
				Path to the webui files/assets (default: is platform specific on Ubuntu it is: /usr/local/share/mesos/webui)
			</td>
		</tr>
		<tr>
			<td> <a name="weights">weights</a> </td>
			<td>
				A comma separated list of role/weight pairs of the form 'role=weight,role=weight'. Weights are used to indicate forms of priority. ex. <code>--weights=etl=2</code>
				All specified roles must be valid meaning they are configured through --roles

				Weights, which do not need to be integers, are used to indicate forms of priority in the allocator.  When weights are specified, a client's DRF share will be divided by the weight. For example, a role that has a weight of 2 will be offered twice as many resources as a role with weight 1.

				So, when a new resource becomes available, the master allocator first checks all the roles to see which role is furthest below its weighted fair share. Then, within that role, it selects the framework that is furthest below its fair share and offers the resource to it.

				<code>--roles="etl,analytics" --weights="etl=2,analytics=1"</code>
				<!-- what are the weights, numbers? how do they work? -->
				<!-- https://www.mail-archive.com/user@mesos.apache.org/msg00635.html -->
			</td>
		</tr>
		<tr>
			<td> <a name="whitelist">whitelist</a> </td>
			<td>
				Path to a file with a list of slaves (one per line) to advertise offers for.
				Path could be of the form 'file:///path/to/file' or '/path/to/file'. (default: *)

				<code>--whitelist=/etc/master/slave-list</code>
				<!-- need the format of the file -->
			</td>
		</tr>
		<tr>
			<td> <a name="work_dir">work_dir</a> </td>
			<td>
				Path to write framework work directories and replication logs. There is no default.
				<code>--work_dir=/tmp/mesosphere</code>
			</td>
		</tr>
		<tr>
			<td> <a name="zk">zk</a> </td>
			<td>
				 ZooKeeper URL (used for leader election amongst masters)
                 May be one of:
                 <ul>
                 	<li> zk://zookeeper1:2181/mesos,zk://zookeeper2:2181/mesos </li>
                 	<li> zk://username:password@zookeeper1:2181/mesos</li>
                 	<li> path to a file that contains one of the above prefixed with file:// </li>
                 </ul>

                 <code>--zk=/etc/mesos/zk</code> <br/>
                 <code>--zk=zk://zookeeper1:2181/mesos</code> <br/>
                 <code>--zk=file:///etc/mesos/zk</code> <br/>

                <div class="alert alert-danger">
					<strong>Note:</strong>
						The zk path must take the form of <code>file:///</code> as outline in the example above.  An absolute path without that prefix will fail.
				</div>
                <div class="alert alert-info">
					<strong>Note:</strong>
						The zk file format is one line with comma delimited zk URLS.
				</div>

			</td>
		</tr>
		<tr>
			<td> <a name="zk_session_timeout">zk_session_timeout</a> </td>
			<td>
				ZooKeeper session timeout. (default: 10secs)
				<code>--zk_session_timeout=30secs</code>
			</td>
		</tr>
	</tbody>
</table>

****

### Example Configuration

The following details the master configuration of the [Mesosphere Playa](https://github.com/mesosphere/playa-mesos) project, which is Mesosphere running in an Ubuntu virtual machine (courtesy of VirtualBox).

* The master starts up with an init script in /etc/init/, the full path is `/etc/init/mesos-master.conf`.  This file executes `/usr/bin/mesos-init-wrapper` in a master mode.
* The file `/etc/default/mesos` is used to set the log directory.
* The file `/etc/default/mesos-master` sets the master port to 5050 and zk to the value in `/etc/mesos/zk`.
* The file `/etc/mesos/zk` provides the ZooKeeper hostname and a way to discover the master which is: `zk://localhost:2181/mesos`.
* The file `/etc/mesos-master/quorum` sets the quorum to `1`.
* The file `/etc/mesos-master/work_dir` sets the work_dir to `/var/lib/mesos`.

