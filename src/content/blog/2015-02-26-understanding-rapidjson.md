---
title: 'Understanding RapidJson'
excerpt: 'An introduction to generating, parsing, and manipulating JSON with the RapidJSON C++ library, with full sample code for writers, documents, and DOM manipulation.'
publishDate: '2015-02-26'
tags:
  - c++
  - json
  - rapidjson
---

With new technologies, software must evolve and adapt. The task was to make cppagent generate output in JSON (JavaScript Object Notation) format. After evaluating different libraries, [RapidJSON](https://github.com/miloyip/rapidjson) was selected, a C++ JSON manipulation library offering speed, simplicity, and cross-platform compiler compatibility. This post explores example code for generating, parsing, and manipulating JSON data.

### Basic JSON Generation

The following sample JSON demonstrates the target output structure:

```json
{
    "hello" : "world" ,
    "t" : true ,
    "f" : false ,
    "i" : 123 ,
    "pi" : 3.1416 ,
    "a": [
        0,
        1,
        2,
        3
    ]
}
```

To generate JSON output, you need:

- A **StringBuffer** object to buffer the JSON output
- A **Writer** object (or **PrettyWriter** for human-readable, indented output)
- **StartObject/EndObject** functions for JSON object braces
- **StartArray/EndArray** functions for array brackets
- Type-specific functions like String(), Uint(), Bool(), Null(), and Double()

### Sample Writer Code

```cpp
#include "rapidjson/stringbuffer.h"
#include "rapidjson/prettywriter.h"
#include <iostream>

using namespace rapidjson;
using namespace std;

template <typename Writer>
void display(Writer& writer);

int main() {
    StringBuffer s;
    PrettyWriter<StringBuffer> writer(s);
    display(writer);
    cout << s.GetString() << endl;   // GetString() stringify the Json
}

template <typename Writer>
void display(Writer& writer){
    writer.StartObject();  // write "{"
    writer.String("hello"); // write string "hello"
    writer.String("world");
    writer.String("t");
    writer.Bool(true);   // write boolean value true
    writer.String("f");
    writer.Bool(false);
    writer.String("n");
    writer.Null();        // write null
    writer.String("i");
    writer.Uint(123);     // write unsigned integer value
    writer.String("pi");
    writer.Double(3.1416); // write floating point numbers
    writer.String("a");
    writer.StartArray();  // write "["
    for (unsigned i = 0; i < 4; i++)
        writer.Uint(i);
    writer.EndArray();   // End Array "]"
    writer.EndObject();  // end Object "}"
}
```

### Manipulating JSON Documents

To modify JSON data:

- Parse the JSON into a **Document** object
- Use a **Value** reference or direct access via `doc['key']` to modify nodes
- Call the **Accept** method with a **Writer** to output the modified document

```cpp
template <typename Document>
void changeDom(Document& d){
    // any of methods shown below can be used to change the document
    Value& node = d["hello"];  // using a reference
    node.SetString("c++"); // call SetString() on the reference
    d["f"] = true; // access directly and change
    d["t"].SetBool(false); // best way
}
```

### Complete Example: Before and After Manipulation

**Before Manipulation:**
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

**After Manipulation:**
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
    ]
}
```

### Complete Implementation

```cpp
#include "rapidjson/stringbuffer.h"
#include "rapidjson/prettywriter.h"
#include "rapidjson/document.h"
#include <iostream>

using namespace rapidjson;
using namespace std;

template <typename Writer>
void display(Writer& writer);

template <typename Document>
void changeDom(Document& d);

int main() {
    StringBuffer s;
    Document d;
    PrettyWriter<StringBuffer> writer(s);
    display(writer);
    cout << "Before Manupulation\n" << s.GetString() << endl;
    d.Parse(s.GetString());
    changeDom(d);
    s.Clear();   // clear the buffer to prepare for a new json document
    writer.Reset(s);  // resetting writer for a fresh json doc
    d.Accept(writer); // writing parsed document to buffer
    cout << "After Manupulation\n" << s.GetString() << endl;
}

template <typename Document>
void changeDom(Document& d){
    Value& node = d["hello"];
    node.SetString("c++");
    d["f"] = true;
    d["t"].SetBool(false);
}

template <typename Writer>
void display(Writer& writer){
    writer.StartObject();
    writer.String("hello");
    writer.String("world");
    writer.String("t");
    writer.Bool(true);
    writer.String("f");
    writer.Bool(false);
    writer.String("n");
    writer.Null();
    writer.String("i");
    writer.Uint(123);
    writer.String("pi");
    writer.Double(3.1416);
    writer.String("a");
    writer.StartArray();
    for (unsigned i = 0; i < 4; i++)
        writer.Uint(i);
    writer.EndArray();
    writer.EndObject();
}
```

**Note:** more complex examples were added in a follow-up post, [Understanding RapidJson – Part 2](https://subhoworld.wordpress.com/2017/10/18/understanding-rapidjson-part-2/).
