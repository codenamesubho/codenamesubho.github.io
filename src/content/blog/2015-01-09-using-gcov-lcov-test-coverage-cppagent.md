---
title: 'Using Gcov and Lcov to generate Test Coverage Stats for Cppagent'
excerpt: 'Tracing through the CMake-generated Makefiles for MTConnect Cppagent to find where to add the --coverage flag so gcov/lcov can produce test coverage data.'
publishDate: '2015-01-09'
tags:
  - FOSS
  - c++
  - code-coverage
  - cppagent
  - gcov
  - lcov
---

In my last post we generated Code coverage statistics for a sample c++. In this post i will be using gcov & lcov to generate similar code coverage for tests in [cppagent](https://github.com/mtconnect/cppagent "Cppagent"). To use gcov we first need to compile the source files with `--coverage` flag. Our sample c++ program was a single file so it was easy to compile, but for cppagent they use makefiles to build the project. Hence, i started with the Makefile looking for the build instructions.

If my previous posts i discussed the steps for building the **agent_test** executable, which starts by running **make** command in *test* folder. So i started tracing the build steps from the **Makefile** in ***test*** folder. Since we run make without any parameters, the default target is going to be executed.

The first few lines of the file were as below.

```makefile
# Default target executed when no arguments are given to make.

default_target: all

.PHONY : default_target
```

These lines specifies that the **default_target** for this build is **all**. On moving down the file we see the rules for **all**.

```makefile
# The main all target

all: cmake_check_build_system

cd /home/subho/work/github/cppagent_new/cppagent && $(CMAKE_COMMAND) -E cmake_progress_start /home/subho/work/github/cppagent_new/cppagent/CMakeFiles /home/subho/work/github/cppagent_new/cppagent/test/CMakeFiles/progress.marks

cd /home/subho/work/github/cppagent_new/cppagent && $(MAKE) -f CMakeFiles/Makefile2 test/all

$(CMAKE_COMMAND) -E cmake_progress_start /home/subho/work/github/cppagent_new/cppagent/CMakeFiles 0

.PHONY : all
```

So here in the line

```makefile
cd /home/subho/work/github/cppagent_new/cppagent && $(MAKE) -f CMakeFiles/Makefile2 test/all
```

We can see **Makefile2** is invoked with target **test/all**.

In *Makefile2* towards the end of the file we can see the **test/all** target build instructions as,

```makefile
# Directory level rules for directory test

# Convenience name for "all" pass in the directory.

test/all: test/CMakeFiles/agent_test.dir/all

.PHONY : test/all
```

The rule says to run the commands defined under target **test/CMakeFiles/agent_test.dir/all**. These commands are:

```makefile
test/CMakeFiles/agent_test.dir/all:

$(MAKE) -f test/CMakeFiles/agent_test.dir/build.make test/CMakeFiles/agent_test.dir/depend

$(MAKE) -f test/CMakeFiles/agent_test.dir/build.make test/CMakeFiles/agent_test.dir/build

$(CMAKE_COMMAND) -E cmake_progress_report /home/subho/work/github/cppagent_new/cppagent/CMakeFiles 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58

@echo "Built target agent_test"

.PHONY : test/CMakeFiles/agent_test.dir/all
```

The first two lines run the ***build.make*** file with target '*test/CMakeFiles/agent_test.dir/depend*' and '*test/CMakeFiles/agent_test.dir/build*' . The build.make contains all the compile instructions for each of the c++ files. This file is in '*test/CMakeFiles/agent_test.dir'* folder along with *flag.make , link.txt* etc files. The **flag.make** file contains all the compile flags and the '**link.txt**' contains the libraries flag needed by linker. On adding the `--coverage` flag to these files we can make the c++ source files compile with gcov linked hence .gcno files are generated when the make command is run.

After that we need to run the agent_test as usual. This will create the data files *.gcda* files. After that we need to gather the .gcda and .gcno files together and run the **lcov** and **genhtml** commands and then the html output will be obtained.

![Coverage report screenshot](https://subhoworld.wordpress.com/wp-content/uploads/2015/01/screenshot-from-2015-01-09-143253.png)
