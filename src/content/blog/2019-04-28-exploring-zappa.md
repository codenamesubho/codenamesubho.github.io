---
title: 'Exploring Zappa'
excerpt: 'Deploying a Django report-scheduler on AWS Lambda with Zappa instead of a traditional web+Celery setup, and the networking, credentials, and SNS gotchas that came with it.'
publishDate: '2019-04-28'
tags:
  - AWS
  - Django
  - Zappa
  - Serverless
---

Recently I worked on a small project whose task was to generate reports and send them via FTP and email on user defined schedule. Pretty simple right? :)

A typical python webapp architecture would be Web server running django/flask and Async server running celery tasks and a broker, so 2 servers and redis/amqp, but this time around I decided to explore serverless architecture. I was aware of [Zappa](https://github.com/Miserlou/Zappa) framework from quite sometime so decided to give it a shot.

Web framework of my choice was Django. So after the application was pretty much done it was time to deploy.

Deploying was simple and seamless `zappa init` and `zappa deploy dev` .

You need to set your zappa config in zappa_settings.json and Done!!

```json
{
    "dev": {
        "django_settings": "report_scheduler.settings.dev",
        "profile_name": "default",
        "project_name": "report-schedule",
        "runtime": "python3.6",
        "s3_bucket": "django-report-store",
        "aws_region": "us-east-1",
        "timeout_seconds": 900,
        "events": [{
           "function": "schedules.task.run_scheduler",
           "expression": "cron(0 * * * ? *)"
         }],
        "vpc_config" : {
            "SubnetIds": [ "subnet-xxxxxx","subnet-xxxxxx" ],
            "SecurityGroupIds": [ "sg-xxxxxx" ]
        }
    }
}
```

Cloudwatch events can trigger periodic tasks in lambda, async lambda invocation can be used instead of celery, Zappa provides a task decorator for that. S3 needs to be used as storage backend for your media and static files.

But there are some Gotchas….

Firstly, Networking. My requirement needed the service to make some API calls and then upload files over FTP and I kept getting connection timeouts. Clearly my lambda is not able to connect to rest of the internet, reason being the [behaviour of lambda inside a VPC](https://edgarroman.github.io/zappa-django-guide/aws_network_primer/#general-behavior-and-internet-access). So I fixed that by creating public and private subnets and using a NAT gateway to connect to internet.(https://gist.github.com/reggi/dc5f2620b7b4f515e68e46255ac042a7)

Secondly, AWS_CREDENTIALS.

```
[1556173956696] An error occurred (InvalidToken) when calling the PutObject operation: The provided token is malformed or otherwise invalid.: ClientError
Traceback (most recent call last):
  File "/var/task/handler.py", line 602, in lambda_handler
  return LambdaHandler.lambda_handler(event, context)
  File "/var/task/handler.py", line 248, in lambda_handler
  return handler.handler(event, context)
  File "/var/task/handler.py", line 413, in handler
  management.call_command(*event['manage'].split(' '))
  File "/var/task/django/core/management/__init__.py", line 148, in call_command
  return command.execute(*args, **defaults)
  File "/var/task/django/core/management/base.py", line 364, in execute
  output = self.handle(*args, **options)
  File "/var/task/django/contrib/staticfiles/management/commands/collectstatic.py", line 188, in handle
  collected = self.collect()
  File "/var/task/django/contrib/staticfiles/management/commands/collectstatic.py", line 114, in collect
  handler(path, prefixed_path, storage)
  File "/var/task/django/contrib/staticfiles/management/commands/collectstatic.py", line 352, in copy_file
  self.storage.save(prefixed_path, source_file)
  File "/var/task/django/core/files/storage.py", line 52, in save
  return self._save(name, content)
  File "/var/task/storages/backends/s3boto3.py", line 506, in _save
  self._save_content(obj, content, parameters=parameters)
  File "/var/task/storages/backends/s3boto3.py", line 521, in _save_content
  obj.upload_fileobj(content, ExtraArgs=put_parameters)
  File "/var/runtime/boto3/s3/inject.py", line 621, in object_upload_fileobj
  ExtraArgs=ExtraArgs, Callback=Callback, Config=Config)
  File "/var/runtime/boto3/s3/inject.py", line 539, in upload_fileobj
  return future.result()
  File "/var/runtime/s3transfer/futures.py", line 73, in result
  return self._coordinator.result()
  File "/var/runtime/s3transfer/futures.py", line 233, in result
  raise self._exception
  File "/var/runtime/s3transfer/tasks.py", line 126, in __call__
  return self._execute_main(kwargs)
  File "/var/runtime/s3transfer/tasks.py", line 150, in _execute_main
  return_value = self._main(**kwargs)
  File "/var/runtime/s3transfer/upload.py", line 692, in _main
  client.put_object(Bucket=bucket, Key=key, Body=body, **extra_args)
  File "/var/runtime/botocore/client.py", line 314, in _api_call
  return self._make_api_call(operation_name, kwargs)
  File "/var/runtime/botocore/client.py", line 612, in _make_api_call
  raise error_class(parsed_response, operation_name)
botocore.exceptions.ClientError: An error occurred (InvalidToken) when calling the PutObject operation: The provided token is malformed or otherwise invalid.
```

Despite AWS_SECRET_ACCESS_KEY and AWS_ACCESS_KEY_ID being defined in my django settings django-storage ignored them. Explanation for this is [here](https://github.com/jschneier/django-storages/issues/606#issuecomment-426136721). Turns out AWS Lambda provides `AWS_SESSION_TOKEN` and `AWS_SECURITY_TOKEN` as environment variables. Even though the IAM role attached to Zappa had permission. Not sure why Lambda provided credentials didn't have access to aws resources. [Quick solution](https://github.com/jschneier/django-storages/issues/606#issuecomment-425623675) was to downgrade django_storage to 1.6.6 when the priority order of fetching the AWS credentials was different so it prioritized the AWS credentials in settings over everything else.

Third, type mismatch while spawning async task via SNS.

```
[1556184504255] Parameter validation failed:
Invalid type for parameter Message, value: b'{"task_path": "schedules.task.execute_scheduled_job", "capture_response": false, "response_id": null, "args": [4], "kwargs": {}, "command": "zappa.asynchronous.route_sns_task"}', type: <class 'bytes'>, valid types: <class 'str'>: ParamValidationError
Traceback (most recent call last):
  File "/var/task/handler.py", line 602, in lambda_handler
  return LambdaHandler.lambda_handler(event, context)
  File "/var/task/handler.py", line 248, in lambda_handler
  return handler.handler(event, context)
  File "/var/task/handler.py", line 382, in handler
  result = self.run_function(app_function, event, context)
  File "/var/task/handler.py", line 283, in run_function
  result = app_function(event, context) if varargs else app_function()
  File "/var/task/schedules/task.py", line 14, in run_scheduler
  execute_scheduled_job(schedule.id)
  File "/var/task/zappa/asynchronous.py", line 427, in _run_async
  capture_response=capture_response).send(task_path, args, kwargs)
  File "/var/task/zappa/asynchronous.py", line 173, in send
  self._send(message)
  File "/var/task/zappa/asynchronous.py", line 252, in _send
  Message=payload
  File "/var/runtime/botocore/client.py", line 314, in _api_call
  return self._make_api_call(operation_name, kwargs)
  File "/var/runtime/botocore/client.py", line 586, in _make_api_call
  api_params, operation_model, context=request_context)
  File "/var/runtime/botocore/client.py", line 621, in _convert_to_request_dict
  api_params, operation_model)
  File "/var/runtime/botocore/validate.py", line 291, in serialize_to_request
  raise ParamValidationError(report=report.generate_report())
botocore.exceptions.ParamValidationError: Parameter validation failed:
Invalid type for parameter Message, value: b'{"task_path": "schedules.task.execute_scheduled_job", "capture_response": false, "response_id": null, "args": [4], "kwargs": {}, "command": "zappa.asynchronous.route_sns_task"}', type: <class 'bytes'>, valid types: <class 'str'>
```

This issue is still open with Zappa https://github.com/Miserlou/Zappa/issues/1323.

Basically after encoding the data is returned as bytes while boto3 expects str type. I just evaded this issue by using @task decorator which invokes async lambda functions directly skipping intermediary SNS.

## Conclusion

As a project I see a lot of potential and promise in Zappa. Setting up is fairly simple. Zappa can set up a warmstart cron to keep your function alive, so that your lambda is more responsive, read more about it [here](https://blog.octo.com/en/cold-start-warm-start-with-aws-lambda/). There are multiple triggers for a lambda, I am using cloudwatch events for periodic tasks. There are options of S3 events, SQS, SNS etc. We all know Lambda can scale easily default is 1000 functions but you can request for more. While warmstart cron does try to keep your function active I still felt latency was slightly higher than a django application deployed on a server. While writing code for serverless there are certain limitations that you need to remember:

- Try not to use Filesystem, Lambda functions are created and destroyed and so are the files you write on disk, Lambda allows you to write files on /tmp only. S3 is the desired option to store your files. Throughout my code I used BytesIO and StringIO like buffered objects to write the data and pass a file like object around the code and the final report file is stored in S3.
- Short Execution Time, default execution time for a lambda function is 30s, you can increase it to maximum 15 minutes. So if you have a long running task you can either split it into smaller components or move to a non lambda approach.
