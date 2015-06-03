// 3rd party libraries
/* global _, AmCharts, moment, React */

// Models
/* global Framework, Machine, Task */

// The global instantiated in index.html
/* exported AppCmp */

var GLOBAL_TICK_DURATION = 2000;
function GlobalTicker() {
  this.components = [];
  this._interval = window.setInterval(this.tick.bind(this), GLOBAL_TICK_DURATION);
}

GlobalTicker.prototype.addComponent = function(component) {
  return this.components.push(component);
};

GlobalTicker.prototype.removeComponent = function(component) {
  return this.components.splice(this.components.indexOf(component), 1);
};

GlobalTicker.prototype.tick = function() {
  this.components.forEach(function(c) {
    if (_.isFunction(c.tick)) c.tick();
    c.forceUpdate();
  });
};

// Yeah this is a global... It is not instantiated until a component mounts
// that mixes `UpdatesOnTick`.
var globalTicker;

// Adds a component to a global list that gets force updated every tick. The
// tick duration is defined in `GlobalTicker`.
var UpdatesOnTick = {
  componentDidMount: function() {
    globalTicker.addComponent(this);
  },

  componentWillMount: function() {
    if (globalTicker == null) globalTicker = new GlobalTicker();
  },

  componentWillUnmount: function() {
    globalTicker.removeComponent(this);
  }
};

var AppCmp = React.createClass({
  displayName: "AppCmp",

  propTypes: {
    machines: React.PropTypes.array
  },

  addFrameworkTask: function(frameworkName) {
    var task = this.state.cluster.createFrameworkTask(frameworkName);
    var scheduled = this.state.cluster.scheduleTask(task);

    if (scheduled) {
      this.forceUpdate();
    } else {
      this.state.cluster.destroyFrameworkTask(frameworkName);
    }
  },

  addCloudMachine: function() {
    this.state.cluster.createCloudMachine();
    this.forceUpdate();
  },

  addMachine: function() {
    this.state.cluster.createMachine();
    this.forceUpdate();
  },

  getInitialState: function() {
    return {
      cluster: this.props.initialCluster
    };
  },

  removeFramework: function(frameworkName) {
    this.state.cluster.destroyFramework(frameworkName);
    this.forceUpdate();
  },

  removeLastCloudMachine: function() {
    if (this.state.cluster.cloudMachines.length >= 1) {
      this.state.cluster.destroyCloudMachine(
        _.last(this.state.cluster.cloudMachines));
      this.forceUpdate();
    }
  },

  removeLastMachine: function() {
    if (this.state.cluster.machines.length >= 1) {
      this.state.cluster.destroyMachine(_.last(this.state.cluster.machines));
      this.forceUpdate();
    }
  },

  removeMachine: function(machine) {
    this.state.cluster.destroyMachine(machine);
    this.forceUpdate();
  },

  setFrameworkLoad: function(frameworkName, frameworkLoad) {
    var didUpdate =
      this.state.cluster.setFrameworkLoad(frameworkName, frameworkLoad);

    if (didUpdate) {
      this.forceUpdate();
    }
  },

  repairMachine: function(machine) {
    this.state.cluster.repairMachine(machine);
    this.forceUpdate();
  },

  sickenMachine: function(machine) {
    this.state.cluster.sickenMachine(machine);
    this.forceUpdate();
  },

  render: function() {
    return (
      React.DOM.div({className: "fill-height"},
        React.DOM.aside({className: "fill-height col-2"},
          FrameworkListCmp({
            frameworks: this.state.cluster.frameworks,
            onAddFrameworkTask: this.addFrameworkTask,
            onRemoveFramework: this.removeFramework
          }),
          React.DOM.div({className: "logo-container text-center"},
            React.DOM.a({href: "/"},
              React.DOM.img({
                alt: "Mesosphere",
                height: "60",
                src: "{% asset_path simulator/mesosphere-logo.png %}",
                width: "84"
              })
            )
          )
        ),
        React.DOM.main({className: "fill-height col-8"},
          React.DOM.h1(null,
            React.DOM.div({className: "btn-group pull-right"},
              ButtonCmp({
                  className: "btn-sm btn-secondary",
                  disabled: this.state.cluster.machines.length === 0,
                  onClick: this.removeLastMachine,
                  title: "Remove server"
                },
                "–"
              ),
              ButtonCmp({
                  className: "btn-sm btn-primary",
                  onClick: this.addMachine,
                  title: "Add server"
                },
                "+"
              )
            ),
            "Datacenter"
          ),
          React.DOM.ul({className: "list-inline"},
            this.state.cluster.machines.map(function(m, i) {
              return (
                React.DOM.li({key: i},
                  MachineCmp({
                    machine: m,
                    onRemoveMachine: this.removeMachine,
                    onRepairMachine: this.repairMachine,
                    onSickenMachine: this.sickenMachine
                  })
                )
              );
            }, this)
          ),
          React.DOM.hr(),
          CloudCanvasCmp({
            cloudMachines: this.state.cluster.cloudMachines,
            maxCloudMachines: this.state.cluster.maxCloudMachines,
            onAddCloudMachine: this.addCloudMachine,
            onRemoveCloudMachine: this.removeLastCloudMachine,
            onRemoveMachine: this.removeMachine,
            onRepairMachine: this.repairMachine,
            onSickenMachine: this.sickenMachine
          })
        ),
        React.DOM.aside({className: "fill-height col-2 stats-bar"},
          StatsBarCmp({
            frameworks: this.state.cluster.activeFrameworks(),
            onFrameworkLoadChange: this.setFrameworkLoad
          })
        )
      )
    );
  }
});

var StatsBarCmp = React.createClass({
  displayName: "StatsBarCmp",

  mixins: [UpdatesOnTick],

  propTypes: {
    frameworks: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Framework)),
    onFrameworkLoadChange: React.PropTypes.func.isRequired
  },

  getDefaultProps: function() {
    return {
      frameworks: []
    };
  },

  tick: function() {
    _.invoke(this.props.frameworks, "updateLoadData");
  },

  render: function() {
    return (
      React.DOM.ul(null,
        this.props.frameworks.map(function(f) {
          return (
            React.DOM.li({key: f.name},
              FrameworkLoadGraph({
                frameworkLoad: f.load,
                frameworkLoadData: f.loadData,
                frameworkName: f.name,
                onFrameworkLoadChange: this.props.onFrameworkLoadChange
              })
            )
          );
        }, this)
      )
    );
  }
});

var FrameworkLoadGraph = React.createClass({
  displayName: "FrameworkLoadGraph",

  propTypes: {
    frameworkLoad: React.PropTypes.number.isRequired,
    frameworkLoadData: React.PropTypes.array.isRequired,
    frameworkName: React.PropTypes.string.isRequired
  },

  dragSliderBtnMouse: function(event) {
    // Add 15px, half the height of the button being dragged, to always
    // vertically center the grab in the button.
    var eventPageY = event.pageY + 15;

    var rect = this.refs.sliderRail.getDOMNode().getBoundingClientRect();
    var height = rect.bottom - rect.top;

    var load;
    if (eventPageY < rect.top) {
      load = 1;
    } else if (eventPageY >= rect.top && eventPageY <= rect.bottom) {
      load = (height - (eventPageY - rect.top)) / height;
    } else {
      load = 0;
    }

    // Round to nearest 20%, minimum of 20%
    load = Math.max((Math.round(load / 0.2) * 0.2), 0.2);

    // Only update if the rounded load value is different from the framework's
    // current load.
    this.props.onFrameworkLoadChange(this.props.frameworkName, load);
  },

  dragSliderBtnTouch: function(event) {
    if (event.targetTouches.length > 0) {
      this.dragSliderBtnMouse(event.targetTouches[0]);
    }
  },

  getInitialState: function() {
    return {
      dragging: false
    };
  },

  startDragging: function(event) {
    if (this.state.dragging) { return; }

    window.addEventListener("touchmove", this.dragSliderBtnTouch, false);
    window.addEventListener("touchend", this.stopDragging, false);
    window.addEventListener("mousemove", this.dragSliderBtnMouse, false);
    window.addEventListener("mouseup", this.stopDragging, false);
    this.setState({dragging: true});
  },

  stopDragging: function(event) {
    if (!this.state.dragging) { return; }

    window.removeEventListener("touchmove", this.dragSliderBtnTouch, false);
    window.removeEventListener("touchend", this.stopDragging, false);
    window.removeEventListener("mousemove", this.dragSliderBtnMouse, false);
    window.removeEventListener("mouseup", this.stopDragging, false);
    this.setState({dragging: false});
  },

  render: function() {
    var bgClassName = "bg-" + this.props.frameworkName.toLowerCase();

    return (
      React.DOM.div({className: "framework-load-container"},
        React.DOM.div({className: "pull-left fill-height", style: {position: "relative"}},
          React.DOM.div({className: "framework-load-slider-bar"},
            React.DOM.div({className: "framework-load-slider-rail", ref: "sliderRail"},
              ButtonCmp(
                {
                  className: "btn-sm btn-slider " + bgClassName + (this.state.dragging ? " btn-slider-grabbing" : ""),
                  onMouseDown: this.startDragging,
                  onMouseUp: this.stopDragging,
                  onTouchEnd: this.stopDragging,
                  onTouchStart: this.startDragging,
                  style: {bottom: this.props.frameworkLoad * 100 + "%"}
                },
                React.DOM.div({className: "icon-bar " + bgClassName}),
                React.DOM.div({className: "icon-bar " + bgClassName}),
                React.DOM.div({className: "icon-bar " + bgClassName})
              )
            )
          )
        ),
        React.DOM.div({className: "framework-load-graph-container fill-height"},
          React.DOM.h5({className: "framework-load-value text-" + this.props.frameworkName.toLowerCase()},
            _.last(this.props.frameworkLoadData).value.toFixed(2)
          ),
          React.DOM.h5({className: "framework-load-title"}, this.props.frameworkName),
          FrameworkLoadSparkGraph({
            frameworkLoad: this.props.frameworkLoad,
            frameworkLoadData: this.props.frameworkLoadData,
            frameworkName: this.props.frameworkName
          })
        )
      )
    );
  }
});

var FRAMEWORK_LINE_COLORS = {
  cassandra: "#1BDAC3",
  chronos: "#08F",
  hadoop: "#FB01B9",
  rails: "#1238F9",
  spark: "#60E531"
};

var FrameworkLoadSparkGraph = React.createClass({
  displayName: "FrameworkLoadSparkGraph",

  propTypes: {
    frameworkLoad: React.PropTypes.number.isRequired,
    frameworkLoadData: React.PropTypes.array.isRequired,
    frameworkName: React.PropTypes.string.isRequired
  },

  getDefaultProps: function() {
    return {
      maxLoadValue: 100
    };
  },

  componentDidMount: function() {
    // line chart, with a bullet at the end
    var chart = this.chart = new AmCharts.AmSerialChart(AmCharts.themes.none);
    chart.dataProvider = this.props.frameworkLoadData;
    chart.categoryField = "day";
    chart.autoMargins = false;
    chart.marginLeft = 5;
    chart.marginRight = 5;
    chart.marginTop = 5;
    chart.marginBottom = 5;

    var graph = new AmCharts.AmGraph();
    graph.valueField = "value";
    graph.bulletField = "bullet";
    graph.showBalloon = false;
    graph.lineColor = FRAMEWORK_LINE_COLORS[this.props.frameworkName.toLowerCase()];
    chart.addGraph(graph);

    var valueAxis = new AmCharts.ValueAxis();
    valueAxis.gridAlpha = 0;
    valueAxis.axisAlpha = 0;
    valueAxis.maximum = Framework.MAX_LOAD_VALUE;
    valueAxis.minimum = 0;
    chart.addValueAxis(valueAxis);

    var categoryAxis = chart.categoryAxis;
    categoryAxis.gridAlpha = 0;
    categoryAxis.axisAlpha = 0;
    categoryAxis.startOnAxis = true;
    chart.write(this.refs.container.getDOMNode());
  },

  componentDidUpdate: function() {
    this.chart.validateData();
  },

  render: function() {
    return (
      React.DOM.div({ref: "container", style: {height: "100px"}})
    );
  }
});

var CloudCanvasCmp = React.createClass({
  displayName: "CloudCanvasCmp",

  propTypes: {
    cloudMachines: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Machine)),
    onAddCloudMachine: React.PropTypes.func.isRequired,
    onRemoveCloudMachine: React.PropTypes.func.isRequired,
    onRemoveMachine: React.PropTypes.func.isRequired,
    onRepairMachine: React.PropTypes.func.isRequired,
    onSickenMachine: React.PropTypes.func.isRequired
  },

  getDefaultProps: function() {
    return {
      cloudMachines: []
    };
  },

  handleClickAddCloudMachine: function() {
    this.props.onAddCloudMachine();
  },

  handleClickRemoveCloudMachine: function() {
    this.props.onRemoveCloudMachine();
  },

  handleRemoveMachine: function(machine) {
    this.props.onRemoveMachine(machine);
  },

  handleRepairMachine: function(machine) {
    this.props.onRepairMachine(machine);
  },

  handleSickenMachine: function(machine) {
    this.props.onSickenMachine(machine);
  },

  render: function() {
    return (
      React.DOM.div(null,
        React.DOM.div({className: "btn-group pull-right"},
          ButtonCmp(
            {
              className: "btn-sm btn-secondary",
              disabled: this.props.cloudMachines.length === 0,
              onClick: this.handleClickRemoveCloudMachine,
              title: "Remove cloud server"
            },
            "–"
          ),
          ButtonCmp(
            {
              className: "btn-sm btn-primary",
              disabled: this.props.cloudMachines.length >= this.props.maxCloudMachines,
              onClick: this.handleClickAddCloudMachine,
              title: "Add cloud server"
            },
            "+"
          )
        ),
        React.DOM.h4({className: "cloud-title"},
          "Public Cloud",
          React.DOM.small(null, "")
        ),
        React.DOM.ul({className: "list-inline"},
          this.props.cloudMachines.map(function(m, i) {
            return (
              React.DOM.li({key: i},
                MachineCmp({
                  machine: m,
                  onRemoveMachine: this.handleRemoveMachine,
                  onRepairMachine: this.handleRepairMachine,
                  onSickenMachine: this.handleSickenMachine
                })
              )
            );
          }, this)
        )
      )
    );
  }

});

var FrameworkListCmp = React.createClass({
  displayName: "FrameworkListCmp",

  propTypes: {
    frameworks: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Framework)),
    onAddFrameworkTask: React.PropTypes.func,
    onRemoveFramework: React.PropTypes.func
  },

  handleClickAddFrameworkTask: function(frameworkName) {
    this.props.onAddFrameworkTask(frameworkName);
  },

  handleClickRemoveFramework: function(frameworkName) {
    this.props.onRemoveFramework(frameworkName);
  },

  render: function() {
    return (
      React.DOM.div({className: "framework-container"},
        React.DOM.h6({className: "list-title"}, ""),
        React.DOM.ul({className: "framework-list"}, this.props.frameworks.map(function(f) {
          return (
            React.DOM.li({key: f.name},
              FrameworkCmp({
                framework: f,
                onAddTask: this.handleClickAddFrameworkTask.bind(null, f.name),
                onRemoveFramework: this.handleClickRemoveFramework.bind(null, f.name)
              })
            )
          );
        }, this))
      )
    );
  }
});

var FrameworkCmp = React.createClass({
  displayName: "FrameworkCmp",

  propTypes: {
    framework: React.PropTypes.instanceOf(Framework).isRequired,
    onAddTask: React.PropTypes.func.isRequired,
    onRemoveFramework: React.PropTypes.func.isRequired
  },

  handleClickAddTask: function() {
    this.props.onAddTask(this.props.framework.name);
  },

  handleClickRemoveFramework: function() {
    this.props.onRemoveFramework(this.props.framework.name);
  },

  render: function() {
    var lowerCaseName = this.props.framework.name.toLowerCase();
    var className = "framework framework-" + lowerCaseName;

    return (
      React.DOM.div({className: className},
        React.DOM.div({className: "btn-group pull-right"},
          ButtonCmp(
            {
              className: "btn-sm btn-secondary",
              disabled: !this.props.framework.isActive(),
              onClick: this.handleClickRemoveFramework,
              title: "Uninstall " + this.props.framework.name + " app"
            },
            "–"
          ),
          ButtonCmp(
            {
              className: "btn-sm btn-primary bg-" + lowerCaseName,
              disabled: this.props.framework.isActive(),
              fill: false,
              onClick: this.handleClickAddTask,
              title: "Install " + this.props.framework.name + " app"
            },
            "+"
          )
        ),
        this.props.framework.name
      )
    );
  }
});

var RelativeTimeCmp = React.createClass({
  displayName: "RelativeTimeCmp",

  mixins: [UpdatesOnTick],

  propTypes: {
    hideSuffix: React.PropTypes.bool,
    time: React.PropTypes.instanceOf(Date).isRequired
  },

  getDefaultProps: function() {
    return {
      hideSuffix: true
    };
  },

  render: function() {
    var m = moment(this.props.time);
    var str = m.fromNow(this.props.hideSuffix);

    // If there's enough space, add an "Added" and an "ago" to the string.
    if (!this.props.hideSuffix) str = "Added " + str;

    return (
      React.DOM.time({dateTime: m.toISOString()}, str)
    );
  }
});

var TaskCmp = React.createClass({
  displayName: "TaskCmp",

  propTypes: {
    task: React.PropTypes.instanceOf(Task).isRequired
  },

  getInitialState: function() {
    return {
      "in": false
    };
  },

  componentDidMount: function() {
    this.delay = _.delay(function() {
      this.setState({"in": true});
      this.delay = null;
    }.bind(this), 500);
  },

  componentWillUnmount: function() {
    if (this.delay != null) {
      clearTimeout(this.delay);
      this.delay = null;
    }
  },

  render: function() {
    var classSetObj = {
      "fade": true,
      "in": this.state["in"],
      "task": true,
    };
    classSetObj["bg-" + this.props.task.frameworkName.toLowerCase()] = true;

    return (
      React.DOM.div(
        {
          className: React.addons.classSet(classSetObj),
          style: {height: this.props.height + "%"}
        },
        React.DOM.h4({className: "task-title"},
          this.props.task.frameworkName.substr(0, 2),
          React.DOM.small({className: "text-muted"},
            RelativeTimeCmp({
              time: this.props.task.createdAt
            })
          )
        )
      )
    );
  }
});

var MachineCmp = React.createClass({
  displayName: "MachineCmp",

  propTypes: {
    machine: React.PropTypes.instanceOf(Machine).isRequired,
    onRemoveMachine: React.PropTypes.func.isRequired,
    onRepairMachine: React.PropTypes.func.isRequired,
    onSickenMachine: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
      overlayVisible: false
    };
  },

  handleMouseOut: function() {
    this.setState({overlayVisible: false});
  },

  handleMouseOver: function() {
    this.setState({overlayVisible: true});
  },

  handleRemoveClick: function() {
    this.props.onRemoveMachine(this.props.machine);
  },

  handleRepairClick: function() {
    this.props.onRepairMachine(this.props.machine);
  },

  handleSickenClick: function() {
    this.props.onSickenMachine(this.props.machine);
  },

  render: function() {
    var machineClassSet = React.addons.classSet({
      "machine": true,
      "machine-unhealthy": !this.props.machine.isHealthy()
    });

    var overlayClassSet = React.addons.classSet({
      "in": this.state.overlayVisible,
      "fade": true,
      "machine-content": true,
      "machine-overlay": true
    });

    var content = this.props.machine.isHealthy() ?
      React.DOM.div({className: "fill-height"},
        this.props.machine.tasks.map(function(t) {
          return TaskCmp({
            height: t.requiredResources / this.props.machine.resources * 100,
            key: t.frameworkName,
            task: t
          });
        }, this)
      ) :
      React.DOM.div({className: "machine-content"},
        React.DOM.div({className: "machine-body text-center text-danger"},
          "!"
        )
      );

    return (
      React.DOM.div({
          className: machineClassSet,
          onMouseOver: this.handleMouseOver,
          onMouseOut: this.handleMouseOut
        },
        content,
        React.DOM.div({className: overlayClassSet},
          React.DOM.div({className: "machine-body btn-group text-center"},
            ButtonCmp({
                className: "btn-sm btn-secondary",
                onClick: this.handleRemoveClick,
                title: "Remove server"
              },
              "–"
            ),
            ButtonCmp({
                className: "btn-sm btn-secondary",
                disabled: !this.props.machine.isHealthy(),
                onClick: this.handleSickenClick,
                title: "Sicken server"
              },
              "⚠"
            ),
            ButtonCmp({
                className: "btn-sm btn-secondary",
                disabled: this.props.machine.isHealthy(),
                onClick: this.handleRepairClick,
                title: "Repair server"
              },
              "⚒"
            )
          )
        )
      )
    );
  }
});

var ButtonCmp = React.createClass({
  displayName: "ButtonCmp",

  propTypes: {
    fill: React.PropTypes.bool,
    title: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      fill: true
    };
  },

  render: function() {
    var children;
    var className = "btn";

    if (this.props.fill) {
      children =
        React.DOM.div({className: "btn-fill"},
          this.props.children
        );
    } else {
      children = this.props.children;
    }

    return (
      this.transferPropsTo(
        React.DOM.button(
          {className: className},
          children
        )
      )
    );
  }
});
