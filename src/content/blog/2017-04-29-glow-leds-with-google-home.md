---
title: 'Glow LEDs with Google Home'
excerpt: 'Voice-controlling LEDs on a Raspberry Pi using Google Home custom commands, Api.ai intents/webhooks, and a small Flask app driving the GPIO pins.'
publishDate: '2017-04-29'
tags:
  - Glow leds
  - google home
  - IoT
  - raspberry pi
---

Recently I tried experimenting with Google Home, trying to voice control LEDs. Majorly the whole thing can be split into two parts,

1. A custom command that makes a web POST request to fetch the result.
2. A simple Flask app that can receive post request with parameters and glow some LEDs based on the POST request data.

For the part one, the custom commands were possible thanks to [Google Actions Apis](https://developers.google.com/actions/develop/conversation). I used [API.AI](https://api.ai/) for my purpose since they had good documentation. I wont go into detail explaining the form fields in [Api.ai](https://api.ai), they have done a good job with documentation and explaining part, I will just share my configurations screenshot for your quick reference and understanding. In Api.ai the conversations are broken into **intents.** I used one intent (Default Welcome Intent) and a followup intent (Default Welcome Intent – custom) for my application.

![top-intents](https://subhoworld.wordpress.com/wp-content/uploads/2017/04/top-intents.png)

Heres my first intent which basically greets the user and asks for a LED colour when the custom command **"glow LEDs"** is activated.

![intent1](https://subhoworld.wordpress.com/wp-content/uploads/2017/04/intent1.png)

As you can see the **User says** is what defines my command, you can add multiple statements in which you want to activate the command. The **Action** and **Contexts** is set when you create a followup Intent. **Text response** is the part which your Google Home will use as response.

Next is the Followup Intent which basically takes the User response as input context (which is handled automatically when you create the followup intent) and looks for required parameters and tries to process the request.

![user_interaction](https://subhoworld.wordpress.com/wp-content/uploads/2017/04/user_interaction.png)

Here the expected **User says** would be a colour (red, blue, green) is what I allowed. In Api.ai you can use their ML to process the speech and find your needed parameters and values. I needed colours hence used **@sys.color.** Their are other entities like @sys.address or @sys.flight etc. If these entities don't serve your purpose then you might want to go vanilla and process the speech on your web-api end. The later part of the Followup Intent is a bit different, we are fulfilling the user request via web-hook here. Here the **Response** is the fallback response incase the web request fails, the success response is received from web-hook response body.

![home-response](https://subhoworld.wordpress.com/wp-content/uploads/2017/04/home-response.png)

The fulfilment option won't be activated until you add your webhook in the **Fulfillment** section. Thats all for the part one. Also you can use [Google Web Simulator](https://developers.google.com/actions/tools/web-simulator) to test your application On the Go.

![webhook.png](https://subhoworld.wordpress.com/wp-content/uploads/2017/04/webhook.png)

In part two, I used a Raspberry Pi, 3 LEDs (red, blue, green), a 1K ohm resistor some wires, a breadboard(optional) and a T-cobbler Board(optional). Now, we will write a flask application that will accept a post request and turn on the required GPIO pin output high/low.

```python
from flask import Flask, request, jsonify
import RPi.GPIO as GPIO

app = Flask(__name__)
BLUE = 12
RED = 13
GREEN = 18

base_response = {
'speech':"Abra Ka Dabra,{color} LED glowing",
'displayText' : "Abra Kaa Daabra, {color} LED glowing",
'source' : 'Manual'}


@app.route('/',methods=['GET','POST'])
def index():
    if request.method == 'GET':
        text = """WELCOME to RBG<br>
        /red -> red LED<br>
        /blue -> blue LED<br>
        /green -> green LED<br>
        /clear -> clear all<br>
        """
        return text
    else:
        req_body = request.get_json()
        color = req_body['result']['resolvedQuery']
        if color == 'red':
            red()
        if color == 'green':
            green()
        if color == 'blue':
            blue()
        response = base_response.copy()
        response['speech'] = response['speech'].format(color=color)
        response['displayText'] = response['displayText'].format(color=color)
        return jsonify(response)


@app.route('/red')
def red():
    GPIO.output(BLUE,GPIO.LOW)
    GPIO.output(RED,GPIO.HIGH)
    GPIO.output(GREEN,GPIO.LOW)
    return "RED"

@app.route('/green')
def green():
    GPIO.output(BLUE,GPIO.LOW)
    GPIO.output(RED,GPIO.LOW)
    GPIO.output(GREEN,GPIO.HIGH)
    return "GREEN"

@app.route('/blue')
def blue():
    GPIO.output(BLUE,GPIO.HIGH)
    GPIO.output(RED,GPIO.LOW)
    GPIO.output(GREEN,GPIO.LOW)
    return "BLUE"

@app.route('/clear')
def clear():
    GPIO.output(BLUE,GPIO.LOW)
    GPIO.output(RED,GPIO.LOW)
    GPIO.output(GREEN,GPIO.LOW)
    return "Cleared"

if __name__ == '__main__':
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(BLUE,GPIO.OUT)
    GPIO.setup(RED,GPIO.OUT)
    GPIO.setup(GREEN,GPIO.OUT)
    app.run(host='0.0.0.0',port=5000,debug=True)
    GPIO.cleanup()
```

You can check with the request and response structure you need from the Api.ai docs. Next, this application receives the calls from api.ai webhook and it triggers the targeted LED depending on the **resolvedQuery.** The above code was written so that I can test locally with get requests too. I used [pagekite.net](http://pagekite.net) to tunnel and expose my flask application to the external world. Following is the circuit diagram for the connections.

![circuit](https://subhoworld.wordpress.com/wp-content/uploads/2017/04/circuit.png)

Following is the Result,

<iframe width="560" height="315" src="https://www.youtube.com/embed/xhU4zozE5cA" title="Glow LEDs with Google Home" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Some more Reads:

1. <https://arstechnica.com/gadgets/2016/12/google-assistant-api-launches-today-so-we-tested-some-custom-voice-commands/>
2. <https://docs.api.ai/docs/actions-on-google-integration>
3. <https://developers.google.com/actions/develop/conversation>
4. <https://developers.google.com/actions/develop/apiai/tutorials/getting-started>
5. <https://developers.google.com/actions/samples/>
6. <https://docs.api.ai/docs/webhook>
7. <https://docs.api.ai/docs/concept-intents#user-says>
