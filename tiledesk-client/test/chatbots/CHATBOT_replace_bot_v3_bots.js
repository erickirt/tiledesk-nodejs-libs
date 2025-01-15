const bot = {
    "webhook_enabled": false,
    "language": "en",
    "name": "ReplaceBotV3 Chatbot",
    "type": "tilebot",
    "attributes": {
      "variables": {
        "replaceChatbotSlug": "replaceChatbotSlug"
      }
    },
    "intents": [
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
        "intent_id": "447a99ad-efb8-4446-bb62-d4167e561674",
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
                    "text": "Replace bot v3",
                    "attributes": {
                      "attachment": {
                        "type": "template",
                        "buttons": [
                          {
                            "uid": "02162c6136004359a285910ec782ead9",
                            "type": "action",
                            "value": "replace by id",
                            "link": "",
                            "target": "blank",
                            "action": "#ba11ed53-9568-4434-8778-bd4917731cd3",
                            "attributes": "",
                            "show_echo": true,
                            "alias": ""
                          },
                          {
                            "uid": "254637a5da274766a4252af534db3f8b",
                            "type": "action",
                            "value": "replace by slug",
                            "link": "",
                            "target": "blank",
                            "action": "#185485fa-7951-42d4-ac95-d28d13cd5409",
                            "attributes": "",
                            "show_echo": true,
                            "alias": ""
                          },
                          {
                            "uid": "cf7779d07adf44aba5c1133f990dd994",
                            "type": "action",
                            "value": "replace by slug var",
                            "link": "",
                            "target": "blank",
                            "action": "#675c2fa4-b9a7-4769-b3aa-4e5d3bd8197c",
                            "attributes": "",
                            "show_echo": true,
                            "alias": ""
                          },
                          {
                            "uid": "ec7267ab58504d44b33446dc930749b6",
                            "type": "action",
                            "value": "replace by slag and block var",
                            "link": "",
                            "target": "blank",
                            "action": "#5608a439-2cc5-4b84-950c-9aec42c23f0e",
                            "attributes": "",
                            "show_echo": true,
                            "alias": ""
                          }
                        ]
                      }
                    }
                  }
                }
              ]
            },
            "text": "Hi, how can I help you?\r\n",
            "_tdActionId": "60ebe054586649f9aa56235b69878e7e"
          }
        ],
        "intent_id": "e0d41604-17d8-42f2-a9a3-e96db81a2b5c",
        "intent_display_name": "welcome",
        "language": "en",
        "attributes": {
          "position": {
            "x": 714,
            "y": 113
          },
          "nextBlockAction": {
            "_tdActionTitle": "",
            "_tdActionId": "c7976ae3-dd21-4b12-90c5-54012a1906f7",
            "_tdActionType": "intent"
          }
        }
      },
      {
        "webhook_enabled": false,
        "enabled": true,
        "actions": [
          {
            "_tdActionType": "intent",
            "intentName": "#e0d41604-17d8-42f2-a9a3-e96db81a2b5c",
            "_tdActionId": "91fab975e7ae412da39912daf4f9a51f"
          }
        ],
        "intent_id": "5c2724e1-c1b6-4e29-81ad-db95d6c05536",
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
            "_tdActionId": "aba3f030-2d76-451a-9d9e-ca7d880fbaa8",
            "_tdActionType": "intent"
          }
        }
      },
      {
        "webhook_enabled": false,
        "enabled": true,
        "actions": [
          {
            "_tdActionTitle": "",
            "_tdActionId": "364e53b0-b6db-4ce3-99cd-88d1bf4cb923",
            "_tdActionType": "replacebotv3",
            "useSlug": false,
            "blockName": "start",
            "botId": "678683b9083f2f0013f41f2d",
            "botSlug": "replace-chatbot"
          }
        ],
        "language": "en",
        "intent_display_name": "replace_by_id",
        "intent_id": "ba11ed53-9568-4434-8778-bd4917731cd3",
        "attributes": {
          "position": {
            "x": 1090,
            "y": -244
          },
          "nextBlockAction": {
            "_tdActionId": "ef478d95-29f8-4080-a8b9-6a9babf88422",
            "_tdActionType": "intent",
            "intentName": ""
          }
        }
      },
      {
        "webhook_enabled": false,
        "enabled": true,
        "actions": [
          {
            "_tdActionTitle": "",
            "_tdActionId": "1959ce92-cc8a-4797-b0bc-bb986efadc5e",
            "_tdActionType": "replacebotv3",
            "useSlug": true,
            "blockName": "start",
            "botSlug": "replace-chatbot-v3",
            "botId": "678683b9083f2f0013f41f2d"
          }
        ],
        "language": "en",
        "intent_display_name": "replace_by_slug",
        "intent_id": "185485fa-7951-42d4-ac95-d28d13cd5409",
        "attributes": {
          "position": {
            "x": 1145,
            "y": -33
          },
          "nextBlockAction": {
            "_tdActionId": "cf027e96-aba4-482a-a7f1-e1e141ccd4fa",
            "_tdActionType": "intent",
            "intentName": ""
          },
          "connectors": {}
        }
      },
      {
        "webhook_enabled": false,
        "enabled": true,
        "actions": [
          {
            "_tdActionTitle": "",
            "_tdActionId": "ad4d0cb2-51bb-42e3-886b-ad35c0390e90",
            "_tdActionType": "setattribute-v2",
            "operation": {
              "operands": [
                {
                  "value": "replace-chatbot-v3",
                  "isVariable": false
                }
              ],
              "operators": []
            },
            "destination": "replaceChatbotSlug"
          },
          {
            "_tdActionTitle": "",
            "_tdActionId": "41e84e05-8cce-41a3-8d62-fdf2dd7b6960",
            "_tdActionType": "replacebotv3",
            "useSlug": true,
            "blockName": "start",
            "botSlug": "{{replaceChatbotSlug}}",
            "botId": null
          }
        ],
        "language": "en",
        "intent_display_name": "replace_by_slug_var",
        "intent_id": "675c2fa4-b9a7-4769-b3aa-4e5d3bd8197c",
        "attributes": {
          "position": {
            "x": 1176,
            "y": 172
          },
          "nextBlockAction": {
            "_tdActionId": "a91843fb-255e-4f1c-9681-3e2817327820",
            "_tdActionType": "intent",
            "intentName": ""
          },
          "connectors": {}
        }
      },
      {
        "webhook_enabled": false,
        "enabled": true,
        "actions": [
          {
            "_tdActionTitle": "",
            "_tdActionId": "2d56d6d0-981e-4eec-9583-5c93f5e4e95e",
            "_tdActionType": "setattribute-v2",
            "operation": {
              "operands": [
                {
                  "value": "replace-chatbot-v3",
                  "isVariable": false
                }
              ],
              "operators": []
            },
            "destination": "replaceChatbotSlug"
          },
          {
            "_tdActionTitle": "",
            "_tdActionId": "52760b6f-958c-4682-b83d-4e3d292ef078",
            "_tdActionType": "setattribute-v2",
            "operation": {
              "operands": [
                {
                  "value": "start",
                  "isVariable": false
                }
              ],
              "operators": []
            },
            "destination": "replaceChatbotBlockName"
          },
          {
            "_tdActionTitle": "",
            "_tdActionId": "e5c33f1a-46af-43fc-a200-7d22fd58b100",
            "_tdActionType": "replacebotv3",
            "useSlug": true,
            "blockName": "{{replaceChatbotBlockName}}",
            "botSlug": "{{replaceChatbotSlug}}",
            "botId": null
          }
        ],
        "language": "en",
        "intent_display_name": "replace_by_slug_block_var",
        "intent_id": "5608a439-2cc5-4b84-950c-9aec42c23f0e",
        "agents_available": false,
        "attributes": {
          "position": {
            "x": 1189,
            "y": 519
          },
          "nextBlockAction": {
            "_tdActionId": "cbf3a718-6759-4d41-98c5-4cf0c408e5aa",
            "_tdActionType": "intent",
            "intentName": ""
          },
          "connectors": {}
        }
      }
    ]
}


const replacedBot = {
    "webhook_enabled": false,
    "language": "en",
    "name": "Replace Chatbot v3",
    "type": "tilebot",
    "intents": [
      {
        "webhook_enabled": false,
        "enabled": true,
        "actions": [
          {
            "_tdActionType": "intent",
            "intentName": "#f13e9707-ba33-4dc7-84d6-610a7c8577a7",
            "_tdActionId": "cf3a314ea16a43dd8d842f22d7121db0"
          }
        ],
        "intent_id": "f9e039bc-0406-46c1-a281-11821b157ffa",
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
            "_tdActionId": "be83ec9e-2d21-4c61-a937-1e1ccc62b45b",
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
        "intent_id": "8dde7d9e-f0a8-4037-adce-43b05f697937",
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
                    "text": "Hi, i'm {{chatbot_name}}",
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
            "_tdActionId": "3b5cdf712f864cc39ac9f6d6c2a66bd1"
          }
        ],
        "intent_id": "f13e9707-ba33-4dc7-84d6-610a7c8577a7",
        "intent_display_name": "welcome",
        "language": "en",
        "attributes": {
          "position": {
            "x": 714,
            "y": 113
          },
          "nextBlockAction": {
            "_tdActionTitle": "",
            "_tdActionId": "d5aa48e6-0068-433c-92d1-419d44cad05e",
            "_tdActionType": "intent"
          }
        }
      }
    ]
}

module.exports = { bot: bot, replacedBot: replacedBot };