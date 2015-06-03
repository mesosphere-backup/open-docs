Magic Mesos
===========

* Clicking "+" on an App (Framework in Mesos) "installs" the App in the cluster
* Number of desired instances is controlled by the slider for each App on the right, 1 - 5 instances
* If an App is installed, it won't go below 1 instance
* The graph is current "load" of the App. If you move the slider to 4 instances but there
  is capacity for only 2, the graph will show load of 2 (with some randomization to make it
  look sort of real)
* "Cloud Canvas" is meant to show potential overflow scenario where your cluster is busy
  and can be expanded with AWS / Google Compute / etc. Apps will prefer your own hardware
  before starting in the cloud to save cost
* "Sickening" a server removes all tasks from it and reschedules them elsewhere in the cluster if
  possible. It will not run other tasks until it is repaired.

## Running it locally

1. Clone this repository
2. Start a webserver in the repo's directory

        python -m SimpleHTTPServer
3. Visit the demo in your browser at [http://localhost:8000](http://localhost:8000)
