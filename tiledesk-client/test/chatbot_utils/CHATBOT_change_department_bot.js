const bot =  {
    "webhook_enabled": false,
    "language": "en",
    "name": "Change Dep Bot",
    "type": "tilebot",
    "intents": [
      {
        "webhook_enabled": false,
        "enabled": true,
        "actions": [
          {
            "_tdActionType": "reply",
            "attributes": {
              "disableInputMessage": false,
              "commands": [
                {
                  "type": "wait",
                  "time": 500
                },
                {
                  "type": "message",
                  "message": {
                    "type": "text",
                    "text": "Change dep from:{{department_name}}",
                    "attributes": {
                      "attachment": {
                        "type": "template",
                        "buttons": []
                      }
                    }
                  }
                }
              ]
            },
            "text": "Hi, how can I help you?\r\n",
            "_tdActionId": "ce04da4911ce4270b436c93973edb220"
          },
          {
            "_tdActionTitle": "",
            "_tdActionId": "b0c8ddc6-d28e-43cc-ba5c-845a2795d73e",
            "_tdActionType": "department",
            "triggerBot": true,
            "depName": "dep test1"
          }
        ],
        "intent_id": "2a376334-ee20-4837-8cc5-3720d8a656b9",
        "intent_display_name": "welcome",
        "language": "en",
        "attributes": {
          "position": {
            "x": 714,
            "y": 113
          },
          "nextBlockAction": {
            "_tdActionTitle": "",
            "_tdActionId": "8846d27c-83a0-433d-a4dd-00c0f45f4d88",
            "_tdActionType": "intent"
          }
        }
      },
      {
        "webhook_enabled": false,
        "enabled": true,
        "actions": [
          {
            "_tdActionType": "reply",
            "text": "I didn't understand. Can you rephrase your question?",
            "attributes": {
              "commands": [
                {
                  "type": "wait",
                  "time": 500
                },
                {
                  "type": "message",
                  "message": {
                    "type": "text",
                    "text": "I didn't understand. Can you rephrase your question?"
                  }
                }
              ]
            }
          }
        ],
        "intent_id": "8e99d85f-6e71-48b7-adc2-a1bf7a70d2ba",
        "intent_display_name": "defaultFallback",
        "language": "en",
        "attributes": {
          "position": {
            "x": 714,
            "y": 528
          }
        }
      },
      {
        "webhook_enabled": false,
        "enabled": true,
        "actions": [
          {
            "_tdActionType": "intent",
            "intentName": "#2a376334-ee20-4837-8cc5-3720d8a656b9",
            "_tdActionId": "314b6ac8768e44f3a380b92bde0496dc"
          }
        ],
        "intent_id": "78599bad-6dd9-429a-867b-18e5740dfa43",
        "question": "\\start",
        "intent_display_name": "start",
        "language": "en",
        "attributes": {
          "position": {
            "x": 172,
            "y": 384
          },
          "nextBlockAction": {
            "_tdActionTitle": "",
            "_tdActionId": "a22b3e2c-077a-4753-867e-a173706d7e3f",
            "_tdActionType": "intent"
          }
        }
      }
    ]
}

module.exports = { bot: bot };