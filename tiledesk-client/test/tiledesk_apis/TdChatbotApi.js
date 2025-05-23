const Utils = require('./utils')

class Chatbot {

    constructor(APIURL, PROJECT_ID, JWT_TOKEN, LOG){
        this.APIURL = APIURL;
        this.PROJECT_ID = PROJECT_ID;
        this.JWT_TOKEN = JWT_TOKEN;
        this.LOG = LOG
    }

    async getAllChatbotFromProject(){

        
    }

    
    async getChatbotById(chatbot_id){
        return new Promise((resolve, reject) => {
            const URL = `${this.APIURL}/${this.PROJECT_ID}/faq_kb/${chatbot_id}`
            const HTTPREQUEST = {
                url: URL,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.JWT_TOKEN
                },
                method: 'GET',
                httpsOptions: this.httpsOptions
            };
            Utils.myrequest(
                HTTPREQUEST,
                function (err, resbody) {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(resbody);
                    }
                }, this.LOG
            );
        });
    }

    async deleteChatbot(chatbot_id){
        return new Promise((resolve, reject) => {
            const URL = `${this.APIURL}/${this.PROJECT_ID}/faq_kb/${chatbot_id}`
            const HTTPREQUEST = {
                url: URL,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.JWT_TOKEN
                },
                method: 'DELETE',
                httpsOptions: this.httpsOptions
            };
            Utils.myrequest(
                HTTPREQUEST,
                function (err, resbody) {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(resbody);
                    }
                }, this.LOG
            );
        });
    }

    async importChatbot(bot_data){
        return new Promise((resolve, reject) => {
            const URL = `${this.APIURL}/${this.PROJECT_ID}/faq_kb/importjson/null/?create=true`
            const HTTPREQUEST = {
                url: URL,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.JWT_TOKEN
                },
                json: bot_data,
                method: 'POST',
                httpsOptions: this.httpsOptions
            };
            Utils.myrequest(
                HTTPREQUEST,
                function (err, resbody) {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(resbody)
                    }
                }, this.log
            );
        });
        
    }

    async getAllFaqs(id){
        return new Promise((resolve, reject) => {
            const URL = `${this.APIURL}/${this.PROJECT_ID}/faq?id_faq_kb=${id}`
            const HTTPREQUEST = {
                url: URL,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.JWT_TOKEN
                },
                method: 'GET',
                httpsOptions: this.httpsOptions
            };
            Utils.myrequest(
                HTTPREQUEST,
                function (err, resbody) {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(resbody)
                    }
                }, this.LOG
            );
        });
    }


    async updateFaq(chatbot_id, intent){
        return new Promise((resolve, reject) => {
            const URL = `${this.APIURL}/${this.PROJECT_ID}/faq/ops_update`
            const HTTPREQUEST = {
                url: URL,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.JWT_TOKEN
                },
                json: {
                    id_faq_kb: chatbot_id,
                    operations: [
                        {type: 'put', intent: intent}
                    ]
                },
                method: 'POST',
                httpsOptions: this.httpsOptions
            };
            Utils.myrequest(
                HTTPREQUEST,
                function (err, resbody) {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(resbody)
                    }
                }, this.LOG
            );
        });
    }

    async publish(chatbot_id, release_note) {
        return new Promise((resolve, reject) => {
            const URL = `${this.APIURL}/${this.PROJECT_ID}/faq_kb/${chatbot_id}/publish`
            const HTTPREQUEST = {
                url: URL,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.JWT_TOKEN
                },
                json: { release_note: release_note },
                method: 'PUT',
                httpsOptions: this.httpsOptions
            };
            Utils.myrequest(
                HTTPREQUEST,
                function (err, resbody) {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(resbody)
                    }
                }, this.LOG
            );
        });
    }

    async restore(chatbot_id, restore_from) {
        return new Promise((resolve, reject) => {
            const URL = `${this.APIURL}/${this.PROJECT_ID}/faq_kb/${chatbot_id}/publish`
            const HTTPREQUEST = {
                url: URL,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.JWT_TOKEN
                },
                json: { restore_from: restore_from },
                method: 'PUT',
                httpsOptions: this.httpsOptions
            };
            Utils.myrequest(
                HTTPREQUEST,
                function (err, resbody) {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(resbody)
                    }
                }, this.LOG
            );
        });
    }

}

module.exports = Chatbot