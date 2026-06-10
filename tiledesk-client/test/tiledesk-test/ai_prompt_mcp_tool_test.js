var assert = require('assert');
const { v4: uuidv4 } = require('uuid');
const { Chat21Client } = require('../../chat21client.js');
require('dotenv').config();
const axios = require('axios');
const { TiledeskClient } = require('../../index.js');

const Auth = require('../tiledesk_apis/TdAuthApi.js');
const TiledeskClientTest = require('../tiledesk_apis/index.js');
const Chat21Auth = require('../tiledesk_apis/Chat21Auth.js');
const { before } = require('mocha');


const LOG_STATUS = (process.env.LOG_STATUS && process.env.LOG_STATUS) === 'true' ? true : false;
let EMAIL = "";
if (process.env && process.env.EMAIL) {
	EMAIL = process.env.EMAIL
}
else {
    throw new Error(".env.EMAIL is mandatory");
}

let PASSWORD = "";
if (process.env && process.env.PASSWORD) {
	PASSWORD = process.env.PASSWORD
}
else {
    throw new Error(".env.PASSWORD is mandatory");
}

// let ECHO_BOT_ID = "";
// if (process.env && process.env.ECHO_BOT_ID) {
// 	ECHO_BOT_ID = process.env.ECHO_BOT_ID
// }
// else {
//     throw new Error(".env.ECHO_BOT_ID is mandatory");
// }

// console.log("process.env.AUTOMATION_TEST_TILEDESK_PROJECT_ID:", process.env.AUTOMATION_TEST_TILEDESK_PROJECT_ID);
let TILEDESK_PROJECT_ID = "";
if (process.env && process.env.AUTOMATION_TEST_TILEDESK_PROJECT_ID) {
	TILEDESK_PROJECT_ID = process.env.AUTOMATION_TEST_TILEDESK_PROJECT_ID
    // console.log("TILEDESK_PROJECT_ID:", TILEDESK_PROJECT_ID);
}
else {
    throw new Error(".env.AUTOMATION_TEST_TILEDESK_PROJECT_ID is mandatory");
}

// console.log("process.env.AUTOMATION_TEST_MQTT_ENDPOINT:", process.env.AUTOMATION_TEST_MQTT_ENDPOINT);
let MQTT_ENDPOINT = "";
if (process.env && process.env.AUTOMATION_TEST_MQTT_ENDPOINT) {
	MQTT_ENDPOINT = process.env.AUTOMATION_TEST_MQTT_ENDPOINT
    // console.log("MQTT_ENDPOINT:", MQTT_ENDPOINT);
}
else {
    throw new Error(".env.AUTOMATION_TEST_MQTT_ENDPOINT is mandatory");
}

let API_ENDPOINT = "";
if (process.env && process.env.AUTOMATION_TEST_API_ENDPOINT) {
	API_ENDPOINT = process.env.AUTOMATION_TEST_API_ENDPOINT
    // console.log("API_ENDPOINT:", API_ENDPOINT);
}
else {
    throw new Error(".env.AUTOMATION_TEST_API_ENDPOINT is mandatory");
}

let CHAT_API_ENDPOINT = "";
if (process.env && process.env.AUTOMATION_TEST_CHAT_API_ENDPOINT) {
	CHAT_API_ENDPOINT = process.env.AUTOMATION_TEST_CHAT_API_ENDPOINT
    // console.log("CHAT_API_ENDPOINT:", CHAT_API_ENDPOINT);
}
else {
    throw new Error(".env.AUTOMATION_TEST_CHAT_API_ENDPOINT is mandatory");
}

let BOT_ID = null;
let USER_ADMIN_TOKEN = null;
let USER_ADMIN_ID = null;

let config = {
    MQTT_ENDPOINT: MQTT_ENDPOINT,
    CHAT_API_ENDPOINT: CHAT_API_ENDPOINT,
    APPID: 'tilechat',
    TILEDESK_PROJECT_ID: TILEDESK_PROJECT_ID
}

let chatClient1 = new Chat21Client(
{
    appId: config.APPID,
    MQTTendpoint: config.MQTT_ENDPOINT,
    APIendpoint: config.CHAT_API_ENDPOINT,
    log: LOG_STATUS
});

let user1 = {
    fullname: 'User 1',
    firstname: 'User',
    lastname: '1',
};

let user_agent = {};
let agent_project_user = {};

let group_id;

describe('CHATBOT: Ai Prompt with MCP Tool', function () {
    this.timeout(50000);

    let handlerId;
    before(() => {
        return new Promise(async (resolve, reject) => {
            if (LOG_STATUS) {
                console.log("MQTT endpoint:", config.MQTT_ENDPOINT);
                console.log("API endpoint:", config.CHAT_API_ENDPOINT);
                console.log("Tiledesk Project Id:", config.TILEDESK_PROJECT_ID);
                console.log("Connecting...");
            }

            /** AUTH ANONYMOUS USER TILEDESK AND CHAT21 */
            const auth = new Auth(API_ENDPOINT);
            const chat21Auth = new Chat21Auth(API_ENDPOINT);
            let userdata = await auth.createAnonymousUser(TILEDESK_PROJECT_ID).catch((err) => { 
                console.error("(before) Auth -> An error occurred during anonym auth:", err);
                process.exit(0)
            });
            let chat21data = await chat21Auth.signInWithCustomToken(userdata.token).catch((err) => { 
                console.error("(before) Chat21Auth -> An error occurred during anonym auth:", err);
                process.exit(0)
            });
            user1.userid = chat21data.userid;
            user1.token = chat21data.token;
            user1.tiledesk_token = userdata.token;

            /**AUTH WITH CREDENTIALS TILEDESK */
            let result = await auth.authEmailPassword(EMAIL, PASSWORD).catch((err) => { 
                console.error("(before) ADMIN Auth -> An error occurred during emailPassword auth:", err);
                reject(err)
                assert.ok(false);
            });
            assert(result.success == true);
            assert(result.token != null);
            assert(result.user)
            assert(result.user._id !== null);
            assert(result.user.email !== null);
            USER_ADMIN_TOKEN = result.token;
            USER_ADMIN_ID = result.user._id
            
            const bot = require('./chatbots/mcp_tool_bot.json');
            
            const tdClientTest = new TiledeskClientTest({
                APIURL: API_ENDPOINT,
                PROJECT_ID: TILEDESK_PROJECT_ID,
                TOKEN: USER_ADMIN_TOKEN
            })
            
            const data = await tdClientTest.chatbot.importChatbot(bot).catch((err) => { 
                console.error(err); 
                reject(err);
            })
            BOT_ID = data._id;
            
            chatClient1.connect(user1.userid, user1.token, () => {
                if (LOG_STATUS) {
                    console.log("chatClient1 connected and subscribed.");
                }
            });
            group_id = "support-group-" + TILEDESK_PROJECT_ID + "-" + uuidv4().replace(/-+/g, "");
            group_name = "Chatbot: test group => " + group_id;
            resolve();
        });
    });

    after(function (done) {
        chatClient1.close(async () => {
            const tdClientTest = new TiledeskClientTest({
                APIURL: API_ENDPOINT,
                PROJECT_ID: TILEDESK_PROJECT_ID,
                TOKEN: USER_ADMIN_TOKEN
            });
            const result = await tdClientTest.chatbot.deleteChatbot(BOT_ID).catch((err) => { 
                assert.ok(false);
            });
            assert(result)
            done()
        });
    });

    afterEach(() => {
        if (handlerId) {
            chatClient1.removeOnMessageAddedHandler(handlerId);
            handlerId = null;
        }
    });


    it.skip('reply_to_user tool', () => {
        return new Promise(async (resolve, reject) => {
            const messageHandler = async (message, topic) => {
                const message_text = 'Google Gemini'
                const model = 'gemini-2.5-flash'
                if(message.recipient !== recipient_id){
                    // reject();
                    return;
                }
            }
        })
    });

    it('reply_and_await_response tool', () => {
        return new Promise(async (resolve, reject) => {
            const messageHandler = async (message, topic) => {
                const message_text = 'reply_and_await_response'
                if(message.recipient !== recipient_id){
                    // reject();
                    return;
                }
                if (LOG_STATUS) {
                    console.log(">(1) Incoming message [sender:" + message.sender_fullname + "]: ", message);
                }
                if (
                    message && 
                    message.attributes?.intentName ===  "welcome" &&
                    message.sender_fullname === "MCP communicator"
                ) {
                    if (LOG_STATUS) {
                        console.log("> Incoming message from 'welcome' intent ok.");
                    }
                    assert(message.attributes, "Expect message.attributes exist")
                    assert(message.attributes.commands, "Expect message.attributes.commands")
                    assert(message.attributes.commands.length >= 2, "Expect message.attributes.commands.length > 2")
                    let commands = message.attributes.commands
                    let command = commands[1]
                    assert.equal(command.type, 'message')
                    assert(command.message, "Expect command.message exist")
                    let msg = command.message
                    assert(msg.text, "Expect msg.text exist")
                    assert.equal(msg.text, 'Select a tool to test from the list', `Expect msg.text to be 'Select a tool to test from the list' but got: ${msg.text} `)
                    
                    //check buttons 
                    assert(msg.attributes, "Expect msg.attribues exist")
                    assert(msg.attributes.attachment, "Expect msg.attributes.attachment exist")
                    assert(msg.attributes.attachment.buttons, "Expect msg.attributes.attachment.buttons exist")
                    assert(msg.attributes.attachment.buttons.length > 0, "Expect msg.attributes.attachment.buttons.length > 0")
                    
                    let button1 = msg.attributes.attachment.buttons[1]
                    assert.strictEqual(button1.value, message_text, 'Expect button1 to have "Google Gemini" as text')
                    assert(button1.action)

                    chatClient1.sendMessage(
                        message_text,
                        'text',
                        recipient_id,
                        "Test support group",
                        user1.fullname,
                        {projectId: config.TILEDESK_PROJECT_ID, action: button1.action },
                        null, // no metadata
                        'group',
                        (err, msg) => {
                            if (err) {
                                console.error("Error send:", err);
                            }
                            if (LOG_STATUS) {
                                console.log("Message Sent ok:", msg);
                            }
                        }
                    )
                }else if(message && message.sender_fullname === "MCP communicator"){
                    assert.equal(message.sender_fullname, "MCP communicator");
                    assert.equal(message.sender, BOT_ID);
                    assert(message.text)
                    if(message.text.includes("nome")){
                        chatClient1.sendMessage(
                            "Mario",
                            'text',
                            recipient_id,
                            "Test support group",
                            user1.fullname,
                            {projectId: config.TILEDESK_PROJECT_ID},
                            null, // no metadata
                            'group',
                            (err, msg) => {
                                if (err) {
                                    console.error("Error send:", err);
                                }
                                if (LOG_STATUS) {
                                    console.log("Message Sent ok:", msg);
                                }
                            }
                        )
                    }else if(message.text.includes("cognome")){
                        chatClient1.sendMessage(
                            "Rossi",
                            'text',
                            recipient_id,
                            "Test support group",
                            user1.fullname,
                            { },
                            null, // no metadata
                            'group',
                            (err, msg) => {
                                if (err) {
                                    console.error("Error send:", err);
                                }
                                if (LOG_STATUS) {
                                    console.log("Message Sent ok:", msg);
                                }
                            }
                        )
                    }else if(message.text.includes("codice fiscale")){
                        chatClient1.sendMessage(
                            "RSSMRA80M01H501W",
                            'text',
                            recipient_id,
                            "Test support group",
                            user1.fullname,
                            {projectId: config.TILEDESK_PROJECT_ID },
                            null, // no metadata
                            'group',
                            (err, msg) => {
                                if (err) {
                                    console.error("Error send:", err);
                                }
                                if (LOG_STATUS) {
                                    console.log("Message Sent ok:", msg);
                                }
                            }
                        )   
                    }else if(message.text.includes("grazie")){
                        assert(message.text)
                        assert(message.sender_fullname)
                        assert(message.sender)
                        assert(message.recipient)
                        assert.equal(message.text, "grazie", "Expect message.text to be 'grazie'");
                        assert.equal(message.sender_fullname, "MCP communicator");
                        assert.equal(message.sender, BOT_ID);
                        assert.equal(message.recipient, recipient_id);
                        assert
                        resolve();
                    }else {
                        // console.log("Message not computed: " + message.text);
                    }
                }
                else {
                    // console.log("Message not computed: " + message.text);
                }
            };

            //add handler to list
            handlerId = chatClient1.onMessageAdded(messageHandler);
            if (LOG_STATUS) {
                console.log("Sending test message...");
            }
            let recipient_id = group_id + '_0';
            triggerConversation(recipient_id, BOT_ID, user1.tiledesk_token, async (err) => {
                if (err) {
                    console.error("An error occurred while triggering echo bot conversation:", err);
                }
            });
        })
    });

    describe('check_available_agents tool', () => {

        before(() => {
            return new Promise(async (resolve, reject) => {
                const tdClientTest = new TiledeskClientTest({
                    APIURL: API_ENDPOINT,
                    PROJECT_ID: TILEDESK_PROJECT_ID,
                    TOKEN: USER_ADMIN_TOKEN
                })
                
                /** SIGNUP AGENT */
                const auth = new Auth(API_ENDPOINT);
                const result_agent = await auth.signUpEmailPassword('agent@tiledesk.com', 'agentTEST@').catch((err) => { 
                    console.error("(before) ADMIN Auth -> An error occurred during emailPassword auth:", err);
                    reject(err)
                    assert.ok(false);
                });
                assert(result_agent.success == true);
                assert(result_agent.user)
                assert(result_agent.user._id !== null);
                assert(result_agent.user.email !== null);
                user_agent = result_agent.user
                
                /** SIGNIN AGENT */
                let result_signIn = await auth.authEmailPassword('agent@tiledesk.com', 'agentTEST@').catch((err) => { 
                    console.error("(before) SIGNIN Auth -> An error occurred during emailPassword auth:", err);
                    reject(err)
                    assert.ok(false);
                });
                assert(result_signIn.success == true);
                assert(result_signIn.token != null, "Expect result_signIn.token exist");
                assert(result_signIn.user, "Expect result_signIn.user exist")
                assert(result_signIn.user._id !== null, "Expect result_signIn.user._id exist");
                assert(result_signIn.user.email !== null, "Expect result_signIn.user.email exist");
                user_agent['token'] = result_signIn.token;

                /** ADD AGENT TO PROJECT AND SETS AS AVAILABLE*/
                /** skip if 3rd parameter of addUserToProject( .., .., true) is set to true */
                const response_addToProject = await tdClientTest.user.addUserToProject(user_agent.email, 'admin', true).catch((err) => {
                    console.error(err); 
                    reject(err);
                    assert.ok(false);
                });
                assert(response_addToProject, "Expect response_addToProject exist")
                assert(response_addToProject._id, "Expect response_addToProject._id exist")
                assert.equal(response_addToProject.id_user, user_agent._id, `Expect user_agent._id to be ${user_agent._id} but got: ${response_addToProject.id_user}`)
                agent_project_user = response_addToProject;

                resolve();
            });
        });

        after(() => {
            return new Promise(async (resolve, reject) => {
                const tdClientTest = new TiledeskClientTest({
                    APIURL: API_ENDPOINT,
                    PROJECT_ID: TILEDESK_PROJECT_ID,
                    TOKEN: USER_ADMIN_TOKEN
                });
                const result_remove_user_from_project = await tdClientTest.user.removeUserToProject(agent_project_user._id).catch((err) => { 
                    assert.ok(false);
                });
                assert(result_remove_user_from_project);
                const result_remove_user = await tdClientTest.user.removeUser(user_agent['token']).catch((err) => { 
                    assert.ok(false);
                });
                assert(result_remove_user.success === true)
                resolve();
            });
        });

        afterEach(() => {
            if (handlerId) {
                chatClient1.removeOnMessageAddedHandler(handlerId);
                handlerId = null;
            }
        });

        it('check_available_agents tool (should text "YES")', () => {
            return new Promise(async (resolve, reject) => {
                const messageHandler = async (message, topic) => {
                    const message_text = 'check_available_agents'
                    if(message.recipient !== recipient_id){
                        reject();
                        return;
                    }
                    if (LOG_STATUS) {
                        console.log(">(1) Incoming message [sender:" + message.sender_fullname + "]: ", message);
                    }
                    if (
                        message && 
                        message.attributes?.intentName ===  "welcome" &&
                        message.sender_fullname === "MCP communicator"
                    ) {
                        if (LOG_STATUS) {
                            console.log("> Incoming message from 'welcome' intent ok.");
                        }
                        assert(message.attributes, "Expect message.attributes exist")
                        assert(message.attributes.commands, "Expect message.attributes.commands")
                        assert(message.attributes.commands.length >= 2, "Expect message.attributes.commands.length > 2")
                        let commands = message.attributes.commands
                        let command = commands[1]
                        assert.equal(command.type, 'message')
                        assert(command.message, "Expect command.message exist")
                        let msg = command.message
                        assert(msg.text, "Expect msg.text exist")
                        assert.equal(msg.text, 'Select a tool to test from the list', `Expect msg.text to be 'Select a tool to test from the list' but got: ${msg.text} `)
                        
                        //check buttons 
                        assert(msg.attributes, "Expect msg.attribues exist")
                        assert(msg.attributes.attachment, "Expect msg.attributes.attachment exist")
                        assert(msg.attributes.attachment.buttons, "Expect msg.attributes.attachment.buttons exist")
                        assert(msg.attributes.attachment.buttons.length > 0, "Expect msg.attributes.attachment.buttons.length > 0")
                        
                        let button1 = msg.attributes.attachment.buttons[2]
                        assert.strictEqual(button1.value, message_text, "Expect button1 to have 'check_available_agents' as text")
                        assert(button1.action)
    
                        chatClient1.sendMessage(
                            message_text,
                            'text',
                            recipient_id,
                            "Test support group",
                            user1.fullname,
                            {projectId: config.TILEDESK_PROJECT_ID, action: button1.action },
                            null, // no metadata
                            'group',
                            (err, msg) => {
                                if (err) {
                                    console.error("Error send:", err);
                                }
                                if (LOG_STATUS) {
                                    console.log("Message Sent ok:", msg);
                                }
                            }
                        )
                    }else if(message && message.sender_fullname === "MCP communicator"){
                        assert(message.text)
                        assert.equal(message.text, "YES", "Expect message.text to be 'YES'");
                        assert.equal(message.sender_fullname, "MCP communicator");
                        assert.equal(message.sender, BOT_ID);
                        assert.equal(message.recipient, recipient_id);
                        resolve();
                    }
                    else {
                        // console.log("Message not computed: " + message.text);
                    }
                };
    
                //add handler to list
                handlerId = chatClient1.onMessageAdded(messageHandler);
                if (LOG_STATUS) {
                    console.log("Sending test message...");
                }
                let recipient_id = group_id + '_1';
                triggerConversation(recipient_id, BOT_ID, user1.tiledesk_token, async (err) => {
                    if (err) {
                        console.error("An error occurred while triggering echo bot conversation:", err);
                    }
                });
            })
        });

        it('check_available_agents tool (should text "NO")', () => {
            return new Promise(async (resolve, reject) => {
                const tdClientTest = new TiledeskClientTest({
                    APIURL: API_ENDPOINT,
                    PROJECT_ID: TILEDESK_PROJECT_ID,
                    TOKEN: USER_ADMIN_TOKEN
                });
    
                let availabilityRes = await tdClientTest.user.setAvailability(agent_project_user._id, false, "").catch((err) => {
                    console.error(err); 
                    reject(err);
                });
                assert(availabilityRes)
                assert.equal(availabilityRes.user_available, false)
                assert(availabilityRes.id)
                assert(availabilityRes.id_user)
                assert(availabilityRes.id_project)
                assert(availabilityRes.role)
                assert.equal(availabilityRes.id, agent_project_user._id)
                assert.equal(availabilityRes.id_user,agent_project_user.id_user)
                assert.equal(availabilityRes.id_project, TILEDESK_PROJECT_ID)
                assert.equal(availabilityRes.role, 'admin')
                
                const messageHandler = async (message, topic) => {
                    const message_text = 'check_available_agents'
                    if(message.recipient !== recipient_id){
                        reject();
                        return;
                    }
                    if (LOG_STATUS) {
                        console.log(">(1) Incoming message [sender:" + message.sender_fullname + "]: ", message);
                    }
                    if (
                        message && 
                        message.attributes?.intentName ===  "welcome" &&
                        message.sender_fullname === "MCP communicator"
                    ) {
                        assert(message.attributes, "Expect message.attributes exist")
                        assert(message.attributes.commands, "Expect message.attributes.commands")
                        assert(message.attributes.commands.length >= 2, "Expect message.attributes.commands.length > 2")
                        let commands = message.attributes.commands
                        let command = commands[1]
                        assert.equal(command.type, 'message')
                        assert(command.message, "Expect command.message exist")
                        let msg = command.message
                        assert(msg.text, "Expect msg.text exist")
                        assert.equal(msg.text, 'Select a tool to test from the list', `Expect msg.text to be 'Select a tool to test from the list' but got: ${msg.text} `)
                        
                        //check buttons 
                        assert(msg.attributes, "Expect msg.attribues exist")
                        assert(msg.attributes.attachment, "Expect msg.attributes.attachment exist")
                        assert(msg.attributes.attachment.buttons, "Expect msg.attributes.attachment.buttons exist")
                        assert(msg.attributes.attachment.buttons.length > 0, "Expect msg.attributes.attachment.buttons.length > 0")
                        
                        let button1 = msg.attributes.attachment.buttons[2]
                        assert.strictEqual(button1.value, message_text, "Expect button1 to have 'check_available_agents' as text")
                        assert(button1.action)
    
                        chatClient1.sendMessage(
                            message_text,
                            'text',
                            recipient_id,
                            "Test support group",
                            user1.fullname,
                            {projectId: config.TILEDESK_PROJECT_ID, action: button1.action },
                            null, // no metadata
                            'group',
                            (err, msg) => {
                                if (err) {
                                    console.error("Error send:", err);
                                }
                                if (LOG_STATUS) {
                                    console.log("Message Sent ok:", msg);
                                }
                            }
                        )
                    }
                    else if(message && message.sender_fullname === "MCP communicator"){
                        assert(message.text)
                        assert.equal(message.text, "NO", "Expect message.text to be 'NO'");
                        assert.equal(message.sender_fullname, "MCP communicator");
                        assert.equal(message.sender, BOT_ID);
                        assert.equal(message.recipient, recipient_id);
                        resolve();
                    }else {
                        // console.log("Message not computed: " + message.text);
                    }
                }
                handlerId = chatClient1.onMessageAdded(messageHandler);
                if (LOG_STATUS) {
                    console.log("Sending test message...");
                }
                let recipient_id = group_id + '_2';
                triggerConversation(recipient_id, BOT_ID, user1.tiledesk_token, async (err) => {
                    if (err) {
                        console.error("An error occurred while triggering echo bot conversation:", err);
                    }
                });
            })
        });
    });

    describe('transfer_to_agent tool', () => {

        before(() => {
            return new Promise(async (resolve, reject) => {
                const tdClientTest = new TiledeskClientTest({
                    APIURL: API_ENDPOINT,
                    PROJECT_ID: TILEDESK_PROJECT_ID,
                    TOKEN: USER_ADMIN_TOKEN
                })
                
                /** SIGNUP AGENT */
                const auth = new Auth(API_ENDPOINT);
                const result_agent = await auth.signUpEmailPassword('agent@tiledesk.com', 'agentTEST@').catch((err) => { 
                    console.error("(before) ADMIN Auth -> An error occurred during emailPassword auth:", err);
                    reject(err)
                    assert.ok(false);
                });
                assert(result_agent.success == true);
                assert(result_agent.user)
                assert(result_agent.user._id !== null);
                assert(result_agent.user.email !== null);
                user_agent = result_agent.user
                
                /** SIGNIN AGENT */
                let result_signIn = await auth.authEmailPassword('agent@tiledesk.com', 'agentTEST@').catch((err) => { 
                    console.error("(before) SIGNIN Auth -> An error occurred during emailPassword auth:", err);
                    reject(err)
                    assert.ok(false);
                });
                assert(result_signIn.success == true);
                assert(result_signIn.token != null, "Expect result_signIn.token exist");
                assert(result_signIn.user, "Expect result_signIn.user exist")
                assert(result_signIn.user._id !== null, "Expect result_signIn.user._id exist");
                assert(result_signIn.user.email !== null, "Expect result_signIn.user.email exist");
                user_agent['token'] = result_signIn.token;

                /** ADD AGENT TO PROJECT AND SETS AS AVAILABLE*/
                /** skip if 3rd parameter of addUserToProject( .., .., true) is set to true */
                const response_addToProject = await tdClientTest.user.addUserToProject(user_agent.email, 'admin', true).catch((err) => {
                    console.error(err); 
                    reject(err);
                    assert.ok(false);
                });
                assert(response_addToProject, "Expect response_addToProject exist")
                assert(response_addToProject._id, "Expect response_addToProject._id exist")
                assert.equal(response_addToProject.id_user, user_agent._id, `Expect user_agent._id to be ${user_agent._id} but got: ${response_addToProject.id_user}`)
                agent_project_user = response_addToProject;

                resolve();
            });
        });

        after(() => {
            return new Promise(async (resolve, reject) => {
                const tdClientTest = new TiledeskClientTest({
                    APIURL: API_ENDPOINT,
                    PROJECT_ID: TILEDESK_PROJECT_ID,
                    TOKEN: USER_ADMIN_TOKEN
                });
                const result_remove_user_from_project = await tdClientTest.user.removeUserToProject(agent_project_user._id).catch((err) => { 
                    assert.ok(false);
                });
                assert(result_remove_user_from_project);
                const result_remove_user = await tdClientTest.user.removeUser(user_agent['token']).catch((err) => { 
                    assert.ok(false);
                });
                assert(result_remove_user.success === true)
                resolve();
            });
        });

        afterEach(() => {
            if (handlerId) {
                chatClient1.removeOnMessageAddedHandler(handlerId);
                handlerId = null;
            }
        });

        it('transfer_to_agent tool (agent online)', () => {
            return new Promise(async (resolve, reject) => {
                let hasReceivedYes = false
                const messageHandler = async (message, topic) => {
                    const message_text = 'transfer_to_agent'
                    if(message.recipient !== recipient_id){
                        reject();
                        return;
                    }
                    if (LOG_STATUS) {
                        console.log(">(1) Incoming message [sender:" + message.sender_fullname + "]: ", message);
                    }
                    if (
                        message && 
                        message.attributes?.intentName ===  "welcome" &&
                        message.sender_fullname === "MCP communicator"
                    ) {
                        assert(message.attributes, "Expect message.attributes exist")
                        assert(message.attributes.commands, "Expect message.attributes.commands")
                        assert(message.attributes.commands.length >= 2, "Expect message.attributes.commands.length > 2")
                        let commands = message.attributes.commands
                        let command = commands[1]
                        assert.equal(command.type, 'message')
                        assert(command.message, "Expect command.message exist")
                        let msg = command.message
                        assert(msg.text, "Expect msg.text exist")
                        assert.equal(msg.text, 'Select a tool to test from the list', `Expect msg.text to be 'Select a tool to test from the list' but got: ${msg.text} `)
                        
                        //check buttons 
                        assert(msg.attributes, "Expect msg.attribues exist")
                        assert(msg.attributes.attachment, "Expect msg.attributes.attachment exist")
                        assert(msg.attributes.attachment.buttons, "Expect msg.attributes.attachment.buttons exist")
                        assert(msg.attributes.attachment.buttons.length > 0, "Expect msg.attributes.attachment.buttons.length > 0")
                        
                        let button1 = msg.attributes.attachment.buttons[3]
                        assert.strictEqual(button1.value, message_text, "Expect button1 to have 'transfer_to_agent' as text")
                        assert(button1.action)
        
                        chatClient1.sendMessage(
                            message_text,
                            'text',
                            recipient_id,
                            "Test support group",
                            user1.fullname,
                            {projectId: config.TILEDESK_PROJECT_ID, action: button1.action },
                            null, // no metadata
                            'group',
                            (err, msg) => {
                                if (err) {
                                    console.error("Error send:", err);
                                }
                                if (LOG_STATUS) {
                                    console.log("Message Sent ok:", msg);
                                }
                            }
                        )
                    }
                    else if(message && message.sender_fullname === "MCP communicator"){
                        assert(message.text)
                        assert.equal(message.text, "YES", "Expect message.text to be 'YES'");
                        assert.equal(message.sender_fullname, "MCP communicator");
                        assert.equal(message.sender, BOT_ID);
                        assert.equal(message.recipient, recipient_id);
                        hasReceivedYes = true
                        
                    } else if(message && message.sender == 'system' && hasReceivedYes){
                        assert(message.text)
                        assert(message.attributes)
                        assert(message.attributes.subtype)
                        assert.equal(message.attributes.subtype, 'info')
                        assert(message.attributes.messagelabel)
                        assert(message.attributes.messagelabel.key)
                        if(message.attributes.messagelabel.key === 'MEMBER_JOINED_GROUP'){
                            assert(message.attributes.messagelabel.parameters)
                            assert(message.attributes.messagelabel.parameters.member_id)
                            assert(message.attributes.messagelabel.parameters.fullname)
                            assert.equal(message.attributes.messagelabel.parameters.member_id, user_agent._id)
                            assert.equal(message.attributes.messagelabel.parameters.firstname, user_agent.firstname)
                            assert.equal(message.attributes.messagelabel.parameters.lastname, user_agent.lastname)
                            resolve();
                        }
                    }
                    else {
                        // console.log("Message not computed: " + message.text);
                    }
                }
    
                handlerId = chatClient1.onMessageAdded(messageHandler);
                if (LOG_STATUS) {
                    console.log("Sending test message...");
                }
                let recipient_id = group_id + '_3';
                triggerConversation(recipient_id, BOT_ID, user1.tiledesk_token, async (err) => {
                    if (err) {
                        console.error("An error occurred while triggering echo bot conversation:", err);
                    }
                });
            });
        });

        it('transfer_to_agent tool (agent offline)', () => {
            return new Promise(async (resolve, reject) => {
                const tdClientTest = new TiledeskClientTest({
                    APIURL: API_ENDPOINT,
                    PROJECT_ID: TILEDESK_PROJECT_ID,
                    TOKEN: USER_ADMIN_TOKEN
                });
    
                let availabilityRes = await tdClientTest.user.setAvailability(agent_project_user._id, false, "").catch((err) => {
                    console.error(err); 
                    reject(err);
                });
                assert(availabilityRes)
                assert.equal(availabilityRes.user_available, false)
                assert(availabilityRes.id)
                assert(availabilityRes.id_user)
                assert(availabilityRes.id_project)
                assert(availabilityRes.role)
                assert.equal(availabilityRes.id, agent_project_user._id)
                assert.equal(availabilityRes.id_user,agent_project_user.id_user)
                assert.equal(availabilityRes.id_project, TILEDESK_PROJECT_ID)
                assert.equal(availabilityRes.role, 'admin')

                const messageHandler = async (message, topic) => {
                    const message_text = 'transfer_to_agent'
                    if(message.recipient !== recipient_id){
                        reject();
                        return;
                    }
                    if (LOG_STATUS) {
                        console.log(">(1) Incoming message [sender:" + message.sender_fullname + "]: ", message);
                    }
                    if (
                        message && 
                        message.attributes?.intentName ===  "welcome" &&
                        message.sender_fullname === "MCP communicator"
                    ) {
                        assert(message.attributes, "Expect message.attributes exist")
                        assert(message.attributes.commands, "Expect message.attributes.commands")
                        assert(message.attributes.commands.length >= 2, "Expect message.attributes.commands.length > 2")
                        let commands = message.attributes.commands
                        let command = commands[1]
                        assert.equal(command.type, 'message')
                        assert(command.message, "Expect command.message exist")
                        let msg = command.message
                        assert(msg.text, "Expect msg.text exist")
                        assert.equal(msg.text, 'Select a tool to test from the list', `Expect msg.text to be 'Select a tool to test from the list' but got: ${msg.text} `)
                        
                        //check buttons 
                        assert(msg.attributes, "Expect msg.attribues exist")
                        assert(msg.attributes.attachment, "Expect msg.attributes.attachment exist")
                        assert(msg.attributes.attachment.buttons, "Expect msg.attributes.attachment.buttons exist")
                        assert(msg.attributes.attachment.buttons.length > 0, "Expect msg.attributes.attachment.buttons.length > 0")
                        
                        let button1 = msg.attributes.attachment.buttons[3]
                        assert.strictEqual(button1.value, message_text, "Expect button1 to have 'transfer_to_agent' as text")
                        assert(button1.action)
        
                        chatClient1.sendMessage(
                            message_text,
                            'text',
                            recipient_id,
                            "Test support group",
                            user1.fullname,
                            {projectId: config.TILEDESK_PROJECT_ID, action: button1.action },
                            null, // no metadata
                            'group',
                            (err, msg) => {
                                if (err) {
                                    console.error("Error send:", err);
                                }
                                if (LOG_STATUS) {
                                    console.log("Message Sent ok:", msg);
                                }
                            }
                        )
                    }
                    else if(message && message.sender_fullname === "MCP communicator"){
                        assert(message.text)
                        assert.equal(message.text, "NO", "Expect message.text to be 'NO'");
                        assert.equal(message.sender_fullname, "MCP communicator");
                        assert.equal(message.sender, BOT_ID);
                        assert.equal(message.recipient, recipient_id);
                        resolve(); 
                    } 
                    else {
                        // console.log("Message not computed: " + message.text);
                    }
                }
    
                handlerId = chatClient1.onMessageAdded(messageHandler);
                if (LOG_STATUS) {
                    console.log("Sending test message...");
                }
                let recipient_id = group_id + '_4';
                triggerConversation(recipient_id, BOT_ID, user1.tiledesk_token, async (err) => {
                    if (err) {
                        console.error("An error occurred while triggering echo bot conversation:", err);
                    }
                });
            });
        });
    });
    
});

async function triggerConversation(request_id, chatbot_id, token, callback) {
    const tdclient = new TiledeskClient(
    {
        APIKEY: "__APIKEY__",
        APIURL: API_ENDPOINT,
        projectId: TILEDESK_PROJECT_ID,
        token: token,
        log: LOG_STATUS
    });
    tdclient.getWidgetSettings((err, result) => {
        if (LOG_STATUS) {
            console.log("Project departments:", result.departments);
        }
        if (result && result.departments) {
            let default_dep = null;
            result.departments.forEach(d => {
                if (d.default === true) {
                    default_dep = d;
                }
            });
            if (default_dep === null) {
                console.error("Error. Default department not found");
                callback("Error. Default department not found");
            }
            const event = {
                name: "new_conversation",
                attributes: {
                    "request_id": request_id, 
                    "department": default_dep.id,
                    "participants": ["bot_" + chatbot_id], 
                    "language": "en", 
                    "subtype": "info", 
                    "fullname": "me", 
                    "email": "me@email.com", 
                    "attributes": { 
                        "requester_id": user1.userid
                    }
                }
            };
            if (LOG_STATUS) {
                console.log("Firing trigger conversation event:", event);
            }
            tdclient.fireEvent(event, function(err, result) {
                if (err) {
                    console.error("An error occurred invoking an event:", err);
                    process.exit(1);
                }
                callback(null);
            });
        }
        else {
            callback(err);
        }
    });
    
}