---
title: 'Understanding RapidJson – Part 2'
excerpt: 'A follow-up to the original RapidJson post with a more detailed example showing how to build nested objects and arrays into a JSON DOM tree in C++.'
publishDate: '2017-10-18'
tags:
  - c++
  - json
  - rapidjson
---

In my previous [blog](https://subhoworld.wordpress.com/2015/02/26/understanding-rapidjson/) on Rapidjson, many people asked for a detailed example in the comments, so here is part 2 of **Understanding Rapidjson** with a slightly detailed example.

We will improve on the previous example and modify the **changeDom** function to add more complex objects to the DOM tree.

```cpp
template <typename Document>
void changeDom(Document& d){
Value& node = d["hello"];
node.SetString("c++");
Document subdoc(&d.GetAllocator());
subdoc.SetObject(); // starting the object
Value arr(kArrayType); // the innermost array
Value::AllocatorType allocator;
for (unsigned i = 0; i < 10; i++)
arr.PushBack(i, allocator); // adding values to array
// adding the array to its parent object and so on
subdoc.AddMember("New", Value(kObjectType).Move().AddMember("Numbers",arr, allocator), subdoc.GetAllocator());
d.AddMember("testing",subdoc, d.GetAllocator()); // finally adding the sub document to the main doc object
d["f"] = true;
d["t"].SetBool(false);
}
```

Here Value objects of type **kArrayType** and **kObjectType** are created and appended to their parent node from innermost to outermost.

### Before Manipulation

```json
{
 "hello": "world",
 "t": true,
 "f": false,
 "n": null,
 "i": 123,
 "pi": 3.1416,
 "a": [
 0,
 1,
 2,
 3
 ]
}
```

### After Manipulation

```json
{
 "hello": "c++",
 "t": false,
 "f": true,
 "n": null,
 "i": 123,
 "pi": 3.1416,
 "a": [
    0,
    1,
    2,
    3
  ],
 "testing": {
     "New": {
         "Numbers": [
             0,
             1,
             2,
             3,
             4,
             5,
             6,
             7,
             8,
             9
         ]
     }
 }
}
```

The **changeDom** function can also be written using the **PrettyWriter** object as follows:

```cpp
template <typename Document>
void changeDom(Document& d){
Value& node = d["hello"];
node.SetString("c++");
Document subdoc(&d.GetAllocator()); // sub-document
// old school write the json element by element
StringBuffer s;
PrettyWriter<StringBuffer> writer(s);
writer.StartObject();
writer.String("New");
writer.StartObject();
writer.String("Numbers");
writer.StartArray();
for (unsigned i = 0; i < 10; i++)
writer.Uint(i);
writer.EndArray();
writer.EndObject();
writer.EndObject();
subdoc.Parse(s.GetString()); // Parsing the string written to buffer to form a sub DOM

d.AddMember("testing",subdoc, d.GetAllocator()); // Attaching the Sub DOM to the Main DOM object
d["f"] = true;
d["t"].SetBool(false);
}
```

Happy Coding! Cheers.

**More reads:**
https://stackoverflow.com/questions/32896695/rapidjson-add-external-sub-document-to-document
