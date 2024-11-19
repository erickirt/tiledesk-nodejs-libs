const bot = {
    "webhook_enabled": false,
    "language": "en",
    "name": "Agent Handoff Chatbot",
    "type": "tilebot",
    "intents": [
      {
        "webhook_enabled": false,
        "enabled": true,
        "actions": [
          {
            "_tdActionTitle": "",
            "_tdActionId": "ec422c8c-1e17-4294-bce7-2bd5c828eb8c",
            "_tdActionType": "agent"
          }
        ],
        "intent_id": "3796a830-a4ab-45b7-8210-fec3cc190255",
        "intent_display_name": "welcome",
        "language": "en",
        "attributes": {
          "position": {
            "x": 717,
            "y": 128
          },
          "nextBlockAction": {
            "_tdActionTitle": "",
            "_tdActionId": "4cc466c8-7253-43ce-8f66-09a9f7e44b60",
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
        "intent_id": "e5a796a3-1bb9-438f-bfdf-150ccdb17c4e",
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
            "intentName": "#3796a830-a4ab-45b7-8210-fec3cc190255",
            "_tdActionId": "220c8110c5b44bf8b1ad52770bc624a7"
          }
        ],
        "intent_id": "e35a82f5-3bab-415b-a971-9f1479d7172f",
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
            "_tdActionId": "7d471504-845a-4b08-8108-e03826154cdb",
            "_tdActionType": "intent"
          }
        }
      }
    ]
}

module.exports = { bot: bot }