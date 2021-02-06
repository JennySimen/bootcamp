const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000;
const FACEBOOK_VERIFY_CODE = 'this_is_our_token';
const ACCESS_TOKEN = "EAA05KOJyu7gBAOZCYUQEKsbO7YZBj2zTZAHXQHlZCEAfkFkfuV90xxnb8rsKZAmbZCCQWZCCqxYra5DZCsf6Vf6ADjGeMMMpO1G7umi9Yaa4RbGBVWfzg07h3KZCegnD70yi6S60k56DxFG8SwYb24VfJG5xDg4wAyTVdAqOHOw7kgQZDZD";


const app = express()
app.use(bodyParser.urlencoded( { extended: false}))
app.use(bodyParser.json())
app.listen((process.env.PORT || 3000))

// server index page
app.get(`/`, (req, res) => {
    res.send(`App deployed`)
})

// facebook webhook used for verification
app.get(`/webhook`, (req, res) => {
    if (req.query[`hub.verify_token`] === FACEBOOK_VERIFY_CODE) {
        console.log(`verified webhook`)
        res.status(200).send(req.query[`hub.challenge`])

    } else {
        console.error(`Verification failed. The token do not match`)
        res.sendStatus(403)

    }
})

app.post('/webhook', function(req, res){
    let messaging_events = req.body.entry[0].messaging;
    for (let i = 0; i < messaging_events.length; i++) {
        let event = messaging_events[i];
        let sender = event.sender.id;
        let postback = event.postback;

        console.log(event);
        if (event.message && event.message.text) {
            let text = event.message.text;

            if (text.toLowerCase() === "order") {
                buttonMenu(sender);
            } else if (text.toLowerCase() === "other") {
                sendText(sender, "We will respond to you  as soon as we can");
            } else if (text.toLowerCase() === "pay") {
                sendText(sender, "Your bill will be brought to you shortly");
            }  else if (text.toLowerCase() === "juice") {
                juiceMenu(sender);
            } else if (text.toLowerCase() === "food") {
                sendText(sender, "We will respond to you  as soon as we can");
            } else if (text.toLowerCase() === "fast food") {
                sendText(sender, "Your bill will be brought to you shortly");
            }
            //  else {
            //     sendText(sender, "Type the letter corresponding to your order");
            // } 
             else {
                sendText(sender, "To visit the menu list type 'order' or to talk to a personnel type 'other' or 'pay' to ask for your bill");
            }
        }

        if (event.hasOwnProperty('postback')) {

            if (IsJsonString(postback.payload)) {
                const payload = JSON.parse(postback.payload);

                if (payload.type === "Greeting") {
                    sendText(sender, "Welcome to our restuarant \nType 'order' to view our menu list");
                }
            } else if (postback.title === "Juice") {
                juiceMenu(sender);
            }
        }

    }
    res.sendStatus(200);
});

function buttonMenu(sender) {
    const resonseData = `{
          "attachment":{
            "type":"template",
            "payload":{
              "template_type":"button",
              "text":"Select a Category",
              "buttons":[
                {
                    "type":"postback",
                    "title":"Food",
                    "payload":"Food"
                },
                {
                    "type":"postback",
                    "title":"Fast food",
                    "payload":"Fast food"
                },
                {
                    "type":"postback",
                    "title":"Juice",
                    "payload":"Juice"
                }
              ]
            }
          }
      }`;

      request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: { access_token: ACCESS_TOKEN },
        method: "POST",
        json: {
            recipient: { id: sender },
            message: resonseData
        }
    },function (error, response, body) {
        if (error) {
            console.log("Sending error", error);
        } else if (response.body.error) {
            console.log("response body error", response.body.error);
        }
    });
} 

// if (event.message && event.message.text) {
//     let choice = event.message.text;

//     if (choice.toLowerCase() === "juice") {
//         juiceMenu(sender);
//     } else if (choice.toLowerCase() === "food") {
//         sendText(sender, "We will respond to you  as soon as we can");
//     } else if (choice.toLowerCase() === "fast food") {
//         sendText(sender, "Your bill will be brought to you shortly");
//     } else {
//         sendText(sender, "Type the letter corresponding to your order");
//     }
// }

function juiceMenu(sender) {
    const firstData = `{
        "attachment":{
            "type":"template",
            "payload":{
              "template_type":"button",
              "text":"Make an order",
              "buttons":[
                {
                    "type":"postback",
                    "title":"yogourt",
                    "payload":"a) yogourt"
                },
                {
                    "type":"postback",
                    "title":"beverage",
                    "payload":"b) beverage"
                },
                {
                    "type":"postback",
                    "title":"Fruit juice",
                    "payload":"c) fruit juice"
                }
              ]
            }
          }
      }`;

      const resonseData = `{
        "attachment":{
            "type":"template",
            "payload":{
              "template_type":"button",
              "text":"Make an order",
              "buttons":[
                {
                    "type":"postback",
                    "title":"yogourt",
                    "payload":"a) yogourt"
                },
                {
                    "type":"postback",
                    "title":"beverage",
                    "payload":"b) beverage"
                },
                {
                    "type":"postback",
                    "title":"Fruit juice",
                    "payload":"c) fruit juice"
                }
              ]
            }
          }
      }`;
      
      request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: { access_token: ACCESS_TOKEN },
        method: "POST",
        json: {
            recipient: { id: sender },
            message: resonseData
        }
    }, function (error, response, body) {
        if (error) {
            console.log("Sending error", error);
        } else if (response.body.error) {
            console.log("response body error", response.body.error);
        }
    });
}
function sendText(sender, text) {
    let message_data = { text: text };
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: { access_token: ACCESS_TOKEN },
        method: "POST",
        json: {
            recipient: { id: sender },
            message: message_data
        }
    }, function (error, response, body) {
        if (error) {
            console.log("Sending error");
        } else if (response.body.error) {
            console.log("response body error");
        }
    });
}
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

// app.listen(port, () => console.log('The app is running on port ' + port));
        
        
// function processPostback(event) {
//     let senderId = event.sender.id;
//     let payload = event.postback.payload;

//     if (payload === "Greeting") {
//       // Get user's first name from the User Profile API
//       // and include it in the greeting
//       request({
//         url: "https://graph.facebook.com/v2.6/" + senderId,
//         qs: {
//           access_token: process.env.PAGE_ACCESS_TOKEN,
//           fields: "first_name"
//         },
//         method: "GET"
//       }, function(error, response, body) {
//         let greeting = "";
//         if (error) {
//           console.log("Error getting user's name: " +  error);
//         } else {
//           let bodyObj = JSON.parse(body);
//           name = bodyObj.first_name;
//           greeting = "Hi " + name + ". ";
//         }
//         let message = greeting + "This is a test bot i am building for my bot development practice";
//         sendMessage(senderId, {text: message});
//       });
//     }
//   }

//   // sends message to user
// function sendMessage(recipientId, message) {
//     request({
//       url: "https://graph.facebook.com/v2.6/me/messages",
//       qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
//       method: "POST",
//       json: {
//         recipient: {id: recipientId},
//         message: message,
//       }
//     }, function(error, response, body) {
//       if (error) {
//         console.log("Error sending message: " + response.error);
//       }
//     });
//   }
  