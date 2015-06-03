/* global _ */

function Task(framework, requiredResources) {
  this.createdAt = new Date();
  this.framework = framework;
  this.frameworkName = framework.name;
  this.requiredResources = requiredResources;
}

function Framework(name, defaultTaskResources) {
  this.defaultTaskResources = defaultTaskResources || 5;
  this.name = name;
  this.tasks = [];
  this.resetLoad();
}

Framework.MAX_LOAD_VALUE = 100;
Framework.MAX_TASKS = 5;

Framework.prototype.createTask = function() {
  var task = new Task(this, this.defaultTaskResources);
  this.tasks.push(task);

  return task;
};

Framework.prototype.desiredTasks = function() {
  return Math.round(this.load * Framework.MAX_TASKS);
};

Framework.prototype.destroyTask = function() {
  var task = _.last(this.tasks);
  this.killTask(task);

  return task;
};

Framework.prototype.isActive = function() {
  return this.tasks.length > 0;
};

Framework.prototype.resetLoad = function() {
  this.load = 0.2;
  this.loadData = [
    {day: 0, value: 0},
    {day: 1, value: 0},
    {day: 2, value: 0},
    {day: 3, value: 0},
    {day: 4, value: 0},
    {day: 5, value: 0},
    {day: 6, value: 0},
    {day: 7, value: 0},
    {day: 8, value: 0},
    {day: 9, value: 0},
    {day: 10, value: 0},
    {day: 11, value: 0},
    {day: 12, value: 0},
    {day: 13, value: 0},
    {day: 14, value: 0},
    {day: 15, value: 0},
    {day: 16, value: 0},
    {day: 17, value: 0},
    {day: 18, value: 0},
    {bullet: "round", day: 19, value: 0}
  ];
};

Framework.prototype.updateLoadData = function() {
  // Kill the earliest day
  this.loadData.shift();

  var last = this.loadData[this.loadData.length - 1];
  delete last.bullet;

  /* Generate a random number between 80% of the current load and the current
   * load. This gives a distribution that keeps "traffic" near the max but
   * adds more variability as the load increases.
   */
  var max = Framework.MAX_LOAD_VALUE * (this.tasks.length / Framework.MAX_TASKS);
  var maxVal = Math.min(max, last.value * 1.2 + max * 0.2);

  /* Let the minimum be either the last value or 70% of the max, whichever value
   * is smaller. This lets load increases appear to slowly increase as the
   * random numbers increase this minimum to (maxVal * 0.7).
   */
  var minVal = Math.min(maxVal * 0.85, Math.max(maxVal * 0.75, last.value * 0.8));
  var newVal = Math.random() * (maxVal - minVal) + minVal;
  this.loadData.push({
    bullet: "round",
    day: last.day + 1,
    value: newVal
  });
};

Framework.prototype.killTask = function(task) {
  var taskIndex = this.tasks.indexOf(task);

  if (taskIndex >= 0) {
    this.tasks.splice(taskIndex, 1);
    if (this.tasks.length === 0) this.resetLoad();

    return true;
  } else {
    return false;
  }
};

function Cluster(config) {
  var c = _.extend({}, Cluster.DEFAULT_CONFIG, config);

  /* Splat config onto this `Cluster` instance, i.e. a key of "frameworks" would
   * become `this.frameworks`.
   */
  _.forEach(c, function(v, k) { this[k] = v; }, this);
}

Cluster.DEFAULT_CONFIG = {
  cloudMachines: [],
  frameworks: [],
  machines: [],
  maxCloudMachines: 4
};

Cluster.prototype.activeFrameworks = function() {
  return _.filter(this.frameworks, function(f) { return f.isActive(); });
};

Cluster.prototype.createFrameworkTask = function(frameworkName) {
  return _.findWhere(this.frameworks, {name: frameworkName}).createTask();
};

Cluster.prototype.createClusterMachine = function(machines) {
  var machine = new Machine();
  machines.push(machine);

  this.activeFrameworks().forEach(function(f) {
    this.matchDesiredFrameworkTasks(f);
  }, this);

  return machine;
};
Cluster.prototype.createMachine = function() { return this.createClusterMachine(this.machines); };
Cluster.prototype.createCloudMachine = function() {
  if (this.cloudMachines.length < this.maxCloudMachines) {
    return this.createClusterMachine(this.cloudMachines);
  }
};

Cluster.prototype.destroyFramework = function(frameworkName) {
  var framework = _.findWhere(this.frameworks, {name: frameworkName});

  /* Clone the array since `Framework.killTask` uses `splice` when killing a
   * task. Modifying the array while iterating over it is neither predictable
   * nor supported.
   */
  var tasksToKill = _.clone(framework.tasks);
  tasksToKill.forEach(function(t) {
    this.killTask(t);
  }, this);
};

Cluster.prototype.destroyFrameworkTask = function(frameworkName) {
  return _.findWhere(this.frameworks, {name: frameworkName}).destroyTask();
};

Cluster.prototype.destroyClusterMachine = function(machines, machine) {
  var mIndex = machines.indexOf(machine);
  machines.splice(mIndex, 1);

  machine.tasks.forEach(function(t) {
    this.scheduleTask(t);
  }, this);

  return machine;
};
Cluster.prototype.destroyMachine = function(machine) {
  return this.destroyClusterMachine(this.machines, machine); };
Cluster.prototype.destroyCloudMachine = function(machine) {
  return this.destroyClusterMachine(this.cloudMachines, machine); };

Cluster.prototype.repairMachine = function(machine) {
  machine.repair();

  this.activeFrameworks().forEach(function(f) {
    this.matchDesiredFrameworkTasks(f);
  }, this);
};

Cluster.prototype.sickenMachine = function(machine) {
  var tasks = machine.tasks;

  machine.sicken();
  tasks.forEach(function(t) {
    this.scheduleTask(t);
  }, this);
};

Cluster.prototype.offerAllResources = function() {
  this.activeFrameworks().forEach(function(f) {
    this.matchDesiredFrameworkTasks(f);
  }, this);
};

Cluster.prototype.matchDesiredFrameworkTasks = function(framework) {
  var desiredTasksDiff = framework.desiredTasks() - framework.tasks.length;

  if (desiredTasksDiff > 0) {
    _.times(desiredTasksDiff, function() {
      this.scheduleTask(this.createFrameworkTask(framework.name)); }, this);
  } else if (desiredTasksDiff < 0) {
    _.times(Math.abs(desiredTasksDiff), function() {
      this.killTask(this.destroyFrameworkTask(framework.name)); }, this);
  }
};

Cluster.prototype.scheduleTask = function(task) {
  function machineCanRunTask(m) { return m.canRunTask(task); }
  function machineShouldRunTask(m) { return m.shouldRunTask(task); }

  var machines = _.shuffle(this.machines);
  var cloudMachines = _.shuffle(this.cloudMachines);

  var freeMachine =
    _.find(machines, machineShouldRunTask) ||
    _.find(machines, machineCanRunTask) ||
    _.find(cloudMachines, machineShouldRunTask) ||
    _.find(cloudMachines, machineCanRunTask);

  if (freeMachine == null) {
    // If it can't be scheduled, kill it.
    this.killTask(task);
    return false;
  } else {
    freeMachine.addTask(task);
    return true;
  }
};

Cluster.prototype.setFrameworkLoad = function(frameworkName, frameworkLoad) {
  var framework = _.findWhere(this.frameworks, {name: frameworkName});

  if (frameworkLoad === framework.load) {
    return false;
  } else {
    framework.load = frameworkLoad;
    this.offerAllResources();
    return true;
  }
};

Cluster.prototype.killTask = function(task) {
  function killMachineTask(m) { return m.killTask(task); }

  _.some(this.cloudMachines, killMachineTask) ||
    _.some(this.machines, killMachineTask);

  _.findWhere(this.frameworks, {name: task.frameworkName}).killTask(task);
};

function Machine() {
  this.resources = Machine.DEFAULT_MAX_RESOURCES;
  this.usedResources = 0;
  this.status = Machine.STATUS_HEALTHY;
  this.tasks = [];
}

Machine.DEFAULT_MAX_RESOURCES = 10;

// An unhealthy `Machine` can not run tasks
Machine.STATUS_HEALTHY = 0;
Machine.STATUS_UNHEALTHY = 1;

Machine.prototype.isHealthy = function() {
  return this.status === Machine.STATUS_HEALTHY;
};

Machine.prototype.freeResources = function() {
  return this.resources - this.usedResources;
};

Machine.prototype.repair = function() { this.status = Machine.STATUS_HEALTHY; };
Machine.prototype.sicken = function() {
  this.status = Machine.STATUS_UNHEALTHY;
  this.killAllTasks();
};

Machine.prototype.addTask = function(task) {
  this.usedResources += task.requiredResources;
  return this.tasks.push(task);
};

Machine.prototype.killAllTasks = function() {
  this.tasks = [];
  this.usedResources = 0;
};

/* Kills the given `Task` if it is running on this `Machine`.
 *
 * Returns true if the given `Task` was found and killed, otherwise false.
 */
Machine.prototype.killTask = function(task) {
  var taskIndex = this.tasks.indexOf(task);

  if (taskIndex >= 0) {
    this.usedResources -= task.requiredResources;
    this.tasks.splice(taskIndex, 1);
    return true;
  } else {
    return false;
  }
};

Machine.prototype.canRunTask = function(task) {
  return (
    this.isHealthy() &&
    this.freeResources() >= task.requiredResources &&
    !this.tasks.some(function(t) { return task.framework === t.framework; })
  );
};

Machine.prototype.shouldRunTask = function(task) {
  return (
    this.canRunTask(task) &&
    this.usedResources > 0
  );
};
