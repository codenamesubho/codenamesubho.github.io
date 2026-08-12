---
title: 'Increasing Postgres column name length'
excerpt: "Notes on hitting Postgres's 63-byte column name limit and 1600-column limit while building pivot/transpose tables for an analytics project, and how to work around both."
publishDate: '2019-04-08'
tags:
  - Python
  - General
---

This blog is more like a bookmark for me, the solution was scavenged from internet. Recently I have been working on an analytics project where I had to generate pivot transpose tables from the data. Now this is the first time I faced the limitations set on postgres database. Since its a pivot, one of my column would be transposed and used as column names here, this is where things started breaking. Writing to postgres failed with error stating column names are not unique. After some digging I realized Postgres has a column name limitation of [63 bytes](https://til.hashrocket.com/posts/8f87c65a0a-postgresqls-max-identifier-length-is-63-bytes) and anything more than that will be truncated hence post truncate multiple keys became the same causing this issue.

Next step was to look at the data in my column, it ranged from 20-300 characters long. I checked with redshift and Bigquery they had similar limitations too, 128 bytes. After looking for sometime found a [solution,](https://stackoverflow.com/questions/6307317/how-to-change-postgres-table-field-name-limit) downloaded the postgres source, changed NAMEDATALEN to 301(remember column name length is always NAMEDATALEN – 1) `src/include/pg_config_manual.h`, followed the steps from [postgres docs](https://www.postgresql.org/docs/9.6/install-short.html) to compile the source and install and run postgres. This has been tested on Postgres 9.6 as of now and it works.

Next up I faced issues with maximum number columns, my pivot table had 1968 columns and postgres has a limitation of 1600 total columns. According to [this answer](https://dba.stackexchange.com/questions/40137/in-postgresql-is-it-possible-to-change-the-maximum-number-of-columns-a-table-ca) I looked into the source comments and that looked quite overwhelming 😛. Also I do not have a control over how many columns will be there post pivot so no matter whatever value i set, in future i might need more columns, so instead I handled the scenario in my application code to split the data across multiple tables and store them.

### References:

1. https://til.hashrocket.com/posts/8f87c65a0a-postgresqls-max-identifier-length-is-63-bytes
2. https://stackoverflow.com/questions/6307317/how-to-change-postgres-table-field-name-limit
3. https://www.postgresql.org/docs/9.6/install-short.html
4. https://dba.stackexchange.com/questions/40137/in-postgresql-is-it-possible-to-change-the-maximum-number-of-columns-a-table-ca
