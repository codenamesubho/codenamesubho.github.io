---
title: 'Learnings from BugYou'
excerpt: 'Notes on building Bugyou, a fedmsg consumer that reports Autocloud image build test results to tracking services, and a gotcha with multiprocessing Manager proxy dicts.'
publishDate: '2016-03-20'
tags:
  - Bugyou
  - fedora-infra
---

This is a long overdue post on a project called [Bugyou](https://pagure.io/bugyou), that recently went live to servers. It is a tool for reporting [Autocloud](https://github.com/kushaldas/autocloud) image build test reports to different tracking services. Its split into two parts. [Bugyou](https://pagure.io/bugyou) and [Bugyou-Plugins](https://pagure.io/bugyou_plugins). Bugyou is essentially a fedmsg consumer here that listens and filters autocloud messages and pushes them down a retask-queue.

On the other end of the queue there is a worker that filters and pushes the messages to different service plugins available. The plugin processes reads these messages and performs the necessary action.

A simple flow of action diagram for this project can be found [here](https://raw.githubusercontent.com/sayanchowdhury/bugyou/docs/docs/diagrams/bugyou.png)

We wanted bugyou-plugins to be able to update topics for bugyou while in execution, hence we came up with a instruction queue, that passes instruction from plugins to bugyou. For accomplishing this I used multiprocessing module and for communication between the processes I used manager proxy dict object. A learning for me while working with manager dict objects is that, "their values don't get updated implicitly as they are proxy objects and they are not aware that their values have changed, hence you need to reassign them everytime."

```python
from multiprocessing import Process,Manager
import time

def message_passer():
    manager = Manager()
    switch = manager.dict()
    switch.update({'lists' : [1,2,3,4]})
    proc = Process(target=keep_printing,args=(switch,))
    proc.start()
    i=1
    while i!=0:
        i=input()
        l = switch['lists']
        l.append(i)
        switch['lists']=l #reassigning here, values wont be updated in switch otherwise
    proc.join()

def keep_printing(switch):
    while True:
        time.sleep(2)
        print switch

if __name__ == '__main__':
    message_passer()
```

**Things to do:**

Make bugyou capable of picking up lost messages from datanomer.
