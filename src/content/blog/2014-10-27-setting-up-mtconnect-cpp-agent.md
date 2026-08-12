---
title: 'Setting up MTConnect C++ Agent'
excerpt: 'How to build MTConnect Cppagent from source, run it against the adapter simulator, query it with curl, and run its test suite.'
publishDate: '2014-10-27'
tags:
  - openSource
  - c++
  - cppagent
  - mtconnect
---

This guide demonstrates how to set up cppagent (MTConnect C++ Agent) and execute tests.

### Initial Setup

Start by cloning the repository from Github. The version hash referenced is `6d57d38cffff4b368f3ec003c2d8868d4f41a988`.

Navigate to the repository root and create a build directory:

```bash
$ cd cppagent
$ mkdir build
$ cd build
$ cmake ..
$ make
```

### Running the Simulator

After compilation completes, copy necessary files to the build/agent directory:

```bash
$ cd agent
$ cp ../../simulator/VMC-3Axis.xml .
$ cp ../../agent/agent.cfg .
```

Edit `agent.cfg` with these settings:

```
Devices = VMC-3Axis.xml
Host = 127.0.0.1
```

Open three terminals. In the first, start the agent:

```bash
$ ./agent
```

Expected output: `MTConnect Agent Version 1.3.0.7 - built on Sun Oct 12 22:20:32 2014`

In the second terminal, run the adapter simulator from the repository simulator folder:

```bash
$ ruby run_scenario.rb -l -p 7878 --scenario -v simple_scenario_1.txt
```

In the third terminal, query the agent:

```bash
$ curl localhost:5000/current
```

This returns XML output that changes with each query. Verify by comparing outputs:

```bash
$ curl localhost:5000/current > 1.xml
$ curl localhost:5000/current > 2.xml
$ diff 1.xml 2.xml
```

### Building Tests

From the repository root:

```bash
$ cd cppagent
$ cmake .
$ cd test
$ make
```

Run tests with the agent active in another terminal:

```bash
$ ./agent_test
```

The test suite executes 200 tests covering adapters, agents, components, connectors, data items, devices, parsers, and asset management, concluding with `OK (200)`.
