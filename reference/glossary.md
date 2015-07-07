---
layout: doc
title: Mesosphere Glossary
---

<table class="table table-striped">

	<thead>
		<tr>
			<th width=20%> term        </th>
			<th> definition            </th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td id="cluster">Cluster</a>                 </td>
			<td> A group of nodes.     </td>
		</tr>
		<tr>
			<td id="containerizer">Containerizer</td>
			<td> The term containerization is a general concept that can encompass such things as resource isolation and packaging.  The containerizer is the component in the Apache Mesos architecture
			which the slave invokes to containerize a task.
			</td>
		</tr>
		<tr>
			<td id="executor">Executor</td>
			<td> The part of a Mesos framework that runs as a process launched on Mesos slaves to run the framework's tasks. </td>
		</tr>
		<tr>
			<td id="framework">Framework</td>
			<td> Software that runs on top of Mesos, and includes both a Scheduler and one or more Executors. Receives resource offers describing CPU, RAM, etc., and allocates them for discrete tasks that can be launched on Mesos-slaves.  An example of a framework is Marathon.      </td>
		</tr>
		<tr >
			<td id="master">Master</td>
			<td> A Mesos master aggregates resource offers from all the slaves and provides them to registered frameworks.   For more details about the Mesos master, read about  <a href="/reference/mesos-master/">Mesos Master Configuration</a>.
			</td>
		</tr>
		<tr>
			<td id="offer">Offer</td>
			<td>  An offer represents available resources (e.g. cpu, disk, memory) which a slave offers to the master and the master hands to the registered frameworks in some order.    </td>
		</tr>
		<tr>
			<td id="quorum">Quorum</td>
			<td> A quorum is the number of server instances coordinating together.  This term is used for ZooKeeper or for the Mesos masters.      </td>
		</tr>
		<tr>
			<td id="slave">Slave</td>
			<td> A Mesos slave runs a discrete Mesos task on behalf of a framework. It is a worker instance registered with the Mesos master.      </td>
		</tr>
		<tr>
			<td id="task">Task</td>
			<td>  A unit of work, scheduled by a framework and executed on a Mesos slave. In Hadoop terminology, this is a "job". In MySQL terminology, this is a "query" or "statement". A task may simply be a Bash command or a Python script.  </td>
		</tr>
		<tr>
			<td id="working_dir">Working directory</td>
			<td> A Mesos master requires a directory on the local file system to write replica logs to.   </td>
		</tr>
	</tbody>

</table>

<script type="text/javascript">
var hash = window.location.hash.substring(1);
document.getElementById(hash).style.backgroundColor="Yellow";
</script>
