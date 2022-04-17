/* 
    Andrea Sponziello - (c) Tiledesk.com
*/

// const request = require('request');
let axios = require('axios');
const { request } = require('express');
const { v4: uuidv4 } = require('uuid');

/**
 * This class is a NodeJS stub for Tiledesk's REST APIs
 */
class TiledeskClient {

  static DEFAULT_API_ENDPOINT = "https://api.tiledesk.com/v2";
  static ASSIGNED_STATUS = 200;
  static UNASSIGNED_STATUS = 100;

  /**
   * Constructor for TiledeskClient object
   *
   * @example
   * const { TiledeskClient } = require('tiledesk-client');
   * const tdclient = new TiledeskClient({APIKEY: 'THE_API_KEY', projectId: 'YOUR_PROJECT_ID', token: 'YOUR_AUTH_TOKEN'});
   * const tdclient = new TiledeskClient({APIKEY: 'THE_API_KEY', projectId: 'YOUR_PROJECT_ID', token: 'YOUR_AUTH_TOKEN', APIURL: 'SELF_HOSTED_INSTANCE_ENDPOINT'});
   * 
   * @param {Object} options JSON configuration.
   * @param {string} options.APIKEY Mandatory. Tiledesk APIKEY
   * @param {string} options.projectId Mandatory. Tiledesk projectId. Will be used in each call on project's APIs.
   * @param {string} options.token Mandatory. Tiledesk authentication token. Will be used in each call on project's APIs.
   * @param {string} options.APIURL Optional. Tiledesk server API endpoint.
   * @param {boolean} options.log Optional. If true HTTP requests are logged.
   */
  constructor(options) {
    // console.log("options:", options)

    if (!options) {
      throw new Error('options.APIKEY, options.projectId and options.token are mandatory.');
    }

    if (!options.APIKEY) {
      throw new Error('options.APIKEY can NOT be null.');
    }
    else {
      this.APIKEY = options.APIKEY;
    }

    if (options && options.APIURL) {
      this.APIURL = options.APIURL
    }
    else {
      this.APIURL = TiledeskClient.DEFAULT_API_ENDPOINT;
    }

    if (!options.projectId) {
      throw new Error('options.projectId can NOT be null.');
    }
    else {
      this.projectId = options.projectId;
    }

    if (!options.token) {
      throw new Error('options.token can NOT be null.');
    }
    else {
      // this.token = options.token;
      this.jwt_token = TiledeskClient.fixToken(options.token)
    }

    this.log = false;
    if (options && options.log) {
      this.log = options.log;
    }
  }

  /** Returns a new request ID for the specified Project.<br>
   * A request's ID has the format:<br>
   * <br>
   * <i>support-group-PROJECT_ID-UNIQUE_ID</i><br>
   * <br>
   * <i>UNIQUE_ID</i> MUST be unique in your Project. <b>This method always returns an <i>UUID</i> for the <i>UNIQUE_ID</i> component</b>.
   * 
   * @param {string} projectId - The project ID for the new request.
  */
  static newRequestId(projectId) {
    const request_id = 'support-group-' + projectId + '-' + uuidv4().replace(/-/g, '');
    return request_id;
  }

  createProject(projectId, callback) {
    // const jwt_token = TiledeskClient.fixToken(token)
    const URL = `${this.APIURL}/projects/${projectId}` // projectId passed as parameter???
    const HTTPREQUEST = {
      url: URL,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      json: true,
      method: 'GET'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
        // if (response.status === 200) {
        //   if (callback) {
        //   callback(null, resbody)
        //   }
        // }
        // else if (callback) {
        //   callback(TiledeskClient.getErr(err, HTTPREQUEST, response, resbody), null);
        // }
      }, this. log);
  }

  /**
   * Returns the project's JSON configuration<br>
   * <a href='https://developer.tiledesk.com/apis/rest-api/projects#get-the-project-detail' target='_blank'>REST API</a>
   * 
   * @param {resultCallback} callback - The callback that handles the response.
   * @param {Object} options - Optional configuration.
   * @param {string} options.token - The token for this request. Overrides instance token (if) provided in constructor.
   * @param {string} options.projectId - The token for this request. Overrides instance token (if) provided in constructor.
   */
  getProjectSettings(callback) {
    // const jwt_token = TiledeskClient.fixToken(this.token)
    const URL = `${this.APIURL}/projects/${this.projectId}`
    const HTTPREQUEST = {
      url: URL,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      // json: true,
      method: 'GET'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
        // if (response.status === 200) {
        //   if (callback) {
        //   callback(null, resbody)
        //   }
        // }
        // else if (callback) {
        //   callback(TiledeskClient.getErr(err, HTTPREQUEST, response, resbody), null);
        // }
      }, this.log);
  }

  // ***************************************************
  // ********************* TEAM ************************
  // ***************************************************

  /**
   * Returns all teammates (aka Project Users, Tiledesk Users invited on a specific project are named "Teammates". They have additional properties and a specific project-userId)<br>
   * <a href='https://developer.tiledesk.com/apis/rest-api/team#get-the-team' target='_blank'>REST API</a>
   * @param {resultCallback} callback - The callback that handles the response.
   */
   getTeam(callback) {
    const URL = `${this.APIURL}/${this.projectId}/project_users`
    const HTTPREQUEST = {
      url: URL,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      method: 'GET'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
      }, this.log
    );
  }

  /**
   * Returns a project's User (aka Teammate, is a User invited on a project, with additional properties and a specific project-userId)
   * @param {string} userId - The Teammate ID. It is the specific ID for this user on this project
   * @param {resultCallback} callback - The callback that handles the response.
   */
  getProjectUser(userId, callback) {
    // const jwt_token = TiledeskClient.fixToken(this.token)
    const URL = `${this.APIURL}/${this.projectId}/project_users/users/${userId}`
    const HTTPREQUEST = {
      url: URL,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      // json: true,
      method: 'GET'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
        // if (response.status === 200) {
        //   if (callback) {
        //   callback(null, resbody)
        //   }
        // }
        // else if (callback) {
        //   callback(TiledeskClient.getErr(err, HTTPREQUEST, response, resbody), null);
        // }
      }, this.log
    );
  }

  /**
   * Updates the authenticated Teammate's (projectUser). The teammate must be invited to the specified project for the update operation taking success.<br>
   * <a href='https://developer.tiledesk.com/apis/rest-api/team#update-the-current-logged-teammate' target='_blank'>REST API</a>
   * 
   * @param {Object} properties - The properties to update. Only the provided properties will be updated, the other properties will stay unchanged.
   * @param {string} properties.role - The teammate role. Permitted values: 'admin', 'agent'.
   * @param {boolean} properties.user_available - The teammate availability. 'true' for available, 'false' for unavailable.
   * @param {number} properties.max_served_chat - The number of concurrent chats the teammate can take at once.
   * @param {Object} properties.attributes - The teammate custom attributes.
   * @param {Object} properties.settings - The teammate settings.
   * @param {resultCallback} callback - The callback that handles the response.
   */
  updateProjectUserCurrentlyLoggedIn(properties, callback) {
    // const jwt_token = TiledeskClient.fixToken(this.token)
    const URL = `${this.APIURL}/${this.projectId}/project_users/`
    const HTTPREQUEST = {
      url: URL,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      json: properties,
      method: 'PUT'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
        // if (response.status === 200) {
        //   if (callback) {
        //   callback(null, resbody)
        //   }
        // }
        // else if (callback) {
        //   callback(TiledeskClient.getErr(err, HTTPREQUEST, response, resbody), null);
        // }
      }, this.log
    );
  }

  /**
   * Updates the Teammate's (projectUser) by ProjectUser's ID. It requires admin role.
   * @param {string} projectUserId - The teammate ID.
   * @param {Object} properties - The properties to update. Only the provided properties will be updated, the other properties will stay unchanged.<br>
   * <b>role {string}</b> - The teammate role. Permitted values: 'admin', 'agent'.
   * <br><b>user_available {boolean}</b> - The teammate availability. 'true' for available, 'false' for unavailable.
   * <br><b>max_served_chat {number}</b> - The number of concurrent chats the teammate can take at once.
   * <br><b>attributes {Object}</b> - The teammate custom attributes.
   * <br><b>settings {Object}</b> - The teammate settings.
   * @param {resultCallback} callback - The callback that handles the response.
   */
   updateProjectUser(projectUserId, properties, callback) {
    // const jwt_token = TiledeskClient.fixToken(token)
    const URL = `${this.APIURL}/${this.projectId}/project_users/${projectUserId}`
    const HTTPREQUEST = {
      url: URL,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      json: properties,
      method: 'PUT'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }

        // if (response.status === 200) {
        //   if (callback) {
        //   callback(null, resbody)
        //   }
        // }
        // else if (callback) {
        //   callback(TiledeskClient.getErr(err, HTTPREQUEST, response, resbody), null);
        // }
      }, this.log
    );
  }

  /**
   * Only updates the available status for the specified Teammate. It requires admin role.
   * @param {string} projectUserId - The teammate ID.
   * @param {boolean} userAvailable - The teammate availability. 'true' for available, 'false' for unavailable.
   * @param {resultCallback} callback - The callback that handles the response.
   */
  updateProjectUserAvailable(projectUserId, userAvailable, callback) {
    // const jwt_token = TiledeskClient.fixToken(token)
    const URL = `${this.APIURL}/${this.projectId}/project_users/${projectUserId}`
    const HTTPREQUEST = {
      url: URL,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      json: {
        user_available: userAvailable
      },
      method: 'PUT'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
        // if (response.status === 200) {
        //   if (callback) {
        //   callback(null, resbody)
        //   }
        // }
        // else if (callback) {
        //   callback(TiledeskClient.getErr(err, HTTPREQUEST, response, resbody), null);
        // }

       
      }, this.log
    );
  }

  /**
   * Only updates the attributes for the specified Teammate. It requires admin role.
   * @param {string} projectUserId - The teammate ID.
   * @param {Object} attributes - The teammate custom attributes.
   * @param {resultCallback} callback - The callback that handles the response.
   */
  updateProjectUserAttributes(projectUserId, attributes, callback) {
    // const jwt_token = TiledeskClient.fixToken(token)
    const URL = `${this.APIURL}/${this.projectId}/project_users/${projectUserId}`
    const HTTPREQUEST = {
      url: URL,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      json: {
        attributes: attributes
      },
      method: 'PUT'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
        // if (response.status === 200) {
        //   if (callback) {
        //   callback(null, resbody)
        //   }
        // }
        // else if (callback) {
        //   callback(TiledeskClient.getErr(err, HTTPREQUEST, response, resbody), null);
        // }
      }, this.log
    );
  }

  /* DEPRECATED, use getAllRequests */
  // getRequests(limit, status, callback) {
  //   // let token;
  //   // if (options && options.token) {
  //   //   token = options.token;
  //   // }
  //   // else if (this.token) {
  //   //   token = this.token;
  //   // }
  //   // else {
  //   //   throw new Error('token can NOT be null.');
  //   // }
  //   // let projectId;
  //   // if (options && options.projectId) {
  //   //   projectId = options.projectId;
  //   // }
  //   // else if (this.projectId) {
  //   //   projectId = this.projectId;
  //   // }
  //   // else {
  //   //   throw new Error('projectId can NOT be null.');
  //   // }
  //   // const jwt_token = TiledeskClient.fixToken(token)
  //   // direction = 1 => oldest must be served first
  //   // const URL = `${this.API_ENDPOINT}/${projectId}/requests?status=${status}&limit=${limit}&direction=1`
  //   let url = new URL(`${this.APIURL}/${this.projectId}/requests`)
  //   url.searchParams.append("status", status);
  //   url.searchParams.append("limit", limit);
  //   url.searchParams.append("direction", 1);
  //   if (options && options.additional_params) {
  //     for (let key in options.additional_params) {
  //       url.searchParams.append(key, options.additional_params[key]);
  //     }
  //   }
  //   // console.log("URL", url.href);
  //   const HTTPREQUEST = {
  //     url: url.href,
  //     headers: {
  //       'Content-Type' : 'application/json',
  //       'Authorization': this.jwt_token
  //     },
  //     // json: true,
  //     method: 'GET'
  //   }
  //   TiledeskClient.myrequest(
  //     HTTPREQUEST,
  //     function(err, response, resbody) {
  //       if (response.status === 200) {
  //         if (callback) {
  //         callback(null, resbody)
  //         }
  //       }
  //       else if (callback) {
  //         callback(TiledeskClient.getErr(err, HTTPREQUEST, response, resbody), null);
  //       }

  //       // if (resbody && resbody.requests) {
  //       //   if (callback) {
  //       //     callback(err, resbody.requests)
  //       //   }
  //       // }
  //       // else {
  //       //   // throw
  //       //   console.log("Error getting requests. Error:", err, " URL", URL, " token:", jwt_token, " Body:", resbody)
  //       // }

  //     }, this.log
  //   );
  // }


  // *******************************************************
  // ********************* REQUESTS ************************
  // *******************************************************

  /**
   * @typedef queryParams
   * @type {Object}
   * @property {string} sortField - what field to sort the results by. Default field is 'createdAt'
   * @property {string} direction - sort direction: 1 (asc) or -1 (desc). Return the results in ascending (1) or descending (-1) order. Defaults to desc (-1)
   * @property {number} page - What page of results to fetch. Defaults to first page.
   * @property {number} limit - Specifies the maximum number of results to be returned. Default is 40 rows
   * @property {string} full_text - Executes a fulltext search query
   * @property {string} status - Filters by request status. Values: 100 for unserved requests, 200 for served requests, 1000 for closed requests, "all" to retrieve all statuses. Default value is status < 1000 so it returns all the opened requests.
   * @property {string} dept_id - Filters by department's ID
   * @property {string} lead - Filters by lead's ID
   * @property {string} participant - Filters by participant ID (agent or bot)
   */

  /**
   * Queries project's requests.
   * @param {queryParams} queryParams - The query parameters.
   * @param {resultCallback} callback - The callback that handles the response.
   * @param {Object} options - Optional configuration.
   * @param {string} options.token - The token for this request. Overrides instance token (if) provided in constructor.
   * @param {string} options.projectId - The token for this request. Overrides instance token (if) provided in constructor.
   */
  getAllRequests(queryParams, callback, options) {
    // let token;
    // if (options && options.token) {
    //   token = options.token;
    // }
    // else if (this.token) {
    //   token = this.token;
    // }
    // else {
    //   throw new Error('token can NOT be null.');
    // }
    // let projectId;
    // if (options && options.projectId) {
    //   projectId = options.projectId;
    // }
    // else if (this.projectId) {
    //   projectId = this.projectId;
    // }
    // else {
    //   throw new Error('projectId can NOT be null.');
    // }
    if (queryParams == null) {
      queryParams = {}
    }
    // const jwt_token = TiledeskClient.fixToken(token)
    // direction = 1 => oldest must be served first
    // const URL = `${this.API_ENDPOINT}/${projectId}/requests?status=${status}&limit=${limit}&direction=1`
    let url = new URL(`${this.APIURL}/${this.projectId}/requests`);
    for (const [key, value] of Object.entries(queryParams)) {
      url.searchParams.append(key, value);
    }
    // url.searchParams.append("status", status);
    // url.searchParams.append("limit", limit);
    // url.searchParams.append("direction", 1);
    // if (options && options.additional_params) {
    //   for (let key in options.additional_params) {
    //     url.searchParams.append(key, options.additional_params[key]);
    //   }
    // }
    // console.log("URL", url.href);
    const HTTPREQUEST = {
      url: url.href,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      // json: true,
      method: 'GET'
    }
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
        // if (response.status === 200) {
        //   if (callback) {
        //   callback(null, resbody)
        //   }
        // }
        // else if (callback) {
        //   callback(TiledeskClient.getErr(err, HTTPREQUEST, response, resbody), null);
        // }

      }, this.log
    );
  }

  /**
   * Gets a reuqest by ID.
   * @param {string} requestId - The request ID.
   * @param {resultCallback} callback - The callback that handles the response.
   */
  getRequestById(requestId, callback) {
    // let token;
    // if (options && options.token) {
    //   token = options.token;
    // }
    // else if (this.token) {
    //   token = this.token;
    // }
    // else {
    //   throw new Error('token can NOT be null.');
    // }
    // let projectId;
    // if (options && options.projectId) {
    //   projectId = options.projectId;
    // }
    // else if (this.projectId) {
    //   projectId = this.projectId;
    // }
    // else {
    //   throw new Error('projectId can NOT be null.');
    // }
    // const jwt_token = TiledeskClient.fixToken(token)
    const URL = `${this.APIURL}/${this.projectId}/requests/${requestId}`
    const HTTPREQUEST = {
      url: URL,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      // json: true,
      method: 'GET'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
        // if (response.status === 200) {
        //   if (callback) {
        //     callback(null, resbody)
        //   }
        // }
        // else if (callback) {
        //   callback(TiledeskClient.getErr(err, HTTPREQUEST, response, resbody), null);
        // }
      }, this.log
    );
  }

  /**
   * Updates the request's participants.<br>
   * <a href='https://developer.tiledesk.com/apis/rest-api/requests#set-the-request-participants' target='_blank'>REST API</a>
   * @param {string} requestId - The request ID.
   * @param {array} participants - the participants (agents or bots) identifiers array
   * @param {resultCallback} callback - The callback that handles the response.
   */
  updateRequestParticipants(requestId, participants, callback) {
    // let token;
    // if (options && options.token) {
    //   token = options.token;
    // }
    // else if (this.token) {
    //   token = this.token;
    // }
    // else {
    //   throw new Error('token can NOT be null.');
    // }
    // let projectId;
    // if (options && options.projectId) {
    //   projectId = options.projectId;
    // }
    // else if (this.projectId) {
    //   projectId = this.projectId;
    // }
    // else {
    //   throw new Error('projectId can NOT be null.');
    // }
    // const jwt_token = TiledeskClient.fixToken(token)
    const URL = `${this.APIURL}/${this.projectId}/requests/${requestId}/participants`
    const HTTPREQUEST = {
      url: URL,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      json: participants,
      method: 'PUT'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
        // if (response.status === 200) {
        //   if (callback) {
        //   callback(null, resbody)
        //   }
        // }
        // else if (callback) {
        //   callback(TiledeskClient.getErr(err, HTTPREQUEST, response, resbody), null);
        // }
      }, this.log
    );
  }

  /**
   * Delete a participant from the request's participants.<br>
   * <a href='https://developer.tiledesk.com/apis/rest-api/requests#delete-a-participant-from-the-request' target='_blank'>REST API</a>
   * @param {string} requestId - The request ID.
   * @param {array} participantId - the participant (agent or bot) identifier
   * @param {resultCallback} callback - The callback that handles the response.
   */
  deleteRequestParticipant(requestId, participantId, callback) {
    const URL = `${this.APIURL}/${this.projectId}/requests/${requestId}/participants/${participantId}`
    const HTTPREQUEST = {
      url: URL,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      //json: participants,
      method: 'DELETE'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
      }, this.log
    );
  }
  
  /**
   * Add a participant to the request's participants.<br>
   * <a href='https://developer.tiledesk.com/apis/rest-api/requests#add-a-participant-to-a-request' target='_blank'>REST API</a>
   * @param {string} requestId - The request ID.
   * @param {array} participantId - the participant (agent or bot) identifier
   * @param {resultCallback} callback - The callback that handles the response.
   */
  addRequestParticipant(requestId, participantId, callback) {
    const URL = `${this.APIURL}/${this.projectId}/requests/${requestId}/participants`
    const HTTPREQUEST = {
      url: URL,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      json: {member: participantId},
      method: 'POST'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
      }, this.log
    );
  }
  
  /**
   * The Request properties JSON object. <a href='https://developer.tiledesk.com/apis/rest-api/requests#update-a-request-by-request_id' target='_blank'>More info</a>.
   * @typedef requestProperties
   * @type {Object}
   * @property {string} first_text - The sender full name
   * @property {string} lead - The Lead ID
   * @property {number} status - The request's status
   * @property {array} tags - The request's tags. It is an array of {string}
   * @property {number} rating - The request's rating. A number between 0 and 5.
   * @property {string} rating_message - The request rating's message.
   * @property {string} language - The request's language.
   * @property {string} sourcePage - The web page's URL where the request originated, if one.
   * 
   */

  /**
   * Updates request's properties.<br>
   * <a href='https://developer.tiledesk.com/apis/rest-api/requests#update-a-request-by-request_id' target='_blank'>REST API</a>
   * 
   * @param {string} requestId - The request ID
   * @param {requestProperties} properties - The Request's properties
   * @param {resultCallback} callback - The callback that handles the response.
   */
   updateRequestProperties(requestId, properties, callback) {
    //const jwt_token = TiledeskClient.fixToken(this.token);
    let URL = `${this.APIURL}/${projectId}/requests/${request_id}/`
    data = properties
    
    const HTTPREQUEST = {
      url: URL,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      json: data,
      method: 'PATCH'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
        // if (response.status === 200) {
        //   if (callback) {
        //     callback(null, resbody)
        //   }
        // }
        // else if (callback) {
        //   callback(TiledeskClient.getErr(err, HTTPREQUEST, response, resbody), null);
        // }
      }, this.log
    );
  }

  /**
   * Updates request's 'attributes' property.<br>
   * <a href='https://developer.tiledesk.com/apis/rest-api/requests#update-the-request-attributes' target='_blank'>REST API</a>
   * 
   * @param {string} requestId - The request ID
   * @param {Object} attributes - The Request's custom attributes object. It's a payload that carries custom information attached to this request.
   * @param {resultCallback} callback - The callback that handles the response.
   */
   updateRequestAttributes(requestId, attributes, callback, options) {
    //const jwt_token = TiledeskClient.fixToken(this.token);
    let URL = `${this.APIURL}/${this.projectId}/requests/${requestId}/attributes`
    let data = attributes
    
    const HTTPREQUEST = {
      url: URL,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      json: data,
      method: 'PATCH'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
        // if (response.status === 200) {
        //   if (callback) {
        //     callback(null, resbody)
        //   }
        // }
        // else if (callback) {
        //   callback(TiledeskClient.getErr(err, HTTPREQUEST, response, resbody), null);
        // }
      }, this.log
    );
  }

/**
 * This callback type is called `resultCallback` and is provided as a return value by each API call.
 *
 * @callback resultCallback
 * @param {Object} error - the error if some occurs, otherwise null
 * @param {Object} result - the response body
 */

  /**
   * Updates the Request department
   * <a href='https://developer.tiledesk.com/apis/rest-api/requests#route-a-request-to-a-department' target='_blank'>REST API</a>
   * 
   * @param {string} requestId - The request ID
   * @param {string} depId - The new department ID
   * @param {Object} options - Optional configuration.
   * @param {string} options.nobot - Optional. Defaults to <i>false</i>. If true ignores (if set) the bot in the Department.
   * @param {resultCallback} callback - The callback that handles the response.
   */
  updateRequestDepartment(requestId, depId, options, callback) {
    let nobot_option_defined = false;
    let nobot = false;
    if (options && options.nobot) {
      nobot = options.nobot;
      nobot_option_defined = true;
    }
    let data = {
      departmentid: depId
    }
    if (nobot_option_defined) {
      data['nobot'] = nobot;
    }
    const HTTPREQUEST = {
      url: `${this.APIURL}/${this.projectId}/requests/${requestId}/departments`,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      json: data,
      method: 'PUT'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
        // if (response.status === 200) {
        //   if (callback) {
        //     callback(null, resbody)
        //   }
        // }
        // else if (callback) {
        //   callback(TiledeskClient.getErr(err, HTTPREQUEST, response, resbody), null);
        // }
      }, this.log
    );
  }

  // *************************************************************
  // *********************** ORCHESTRATION ***********************
  // *************************************************************

  /**
   * Updates the Request removing the current chatbot (if any) and adding the new one. Then it sends the hidden 'start' message.
   * 
   * <b>Orchestration APIs</b> (Mashup of REST APIs)
   * 
   * @param {string} requestId - The request ID
   * @param {string} botId - The id of the bot to add in the conversation.
   * @param {resultCallback} callback - The callback that handles the response.
   */
   changeBot(requestId, botId, callback) {
    if (!requestId || !botId) {
      callback({'message': 'botAsPartecipantId is undefined'});
      return;
    }
    let message = {
      text: 'start',
      attributes: {
        subtype: 'info'
      }
    }
    let botAsPartecipantId = botId;
    if (!botId.startsWith("bot_")) {
      botAsPartecipantId = "bot_" + botId;
    }
    this.getRequestById(requestId, (err, result) => {
      if (err) {
        callback({'message': 'getRequestById() error'});
      }
      const request = result;
      if (request.participantsBots && request.participantsBots.length > 0) {
        //console.log("request already participated by bots", request.participantsBots);
        const first_bot = request.participantsBots[0];
        const first_bot_id_as_partecipant = "bot_" + first_bot;
        this.deleteRequestParticipant(requestId, first_bot_id_as_partecipant, (err) => {
          this.addParticipantAndMessage(requestId, botAsPartecipantId, message, (err) => {
            if (err) {
              callback(err);
            }
            else {
              callback();
            }
          });
        });
      }
      else {
        this.addParticipantAndMessage(requestId, botAsPartecipantId, message, (err) => {
          if (err) {
            callback(err);
          }
          else {
            callback();
          }
        });
      }
    });
  }

  /**
   * Updates the Request removing the current chatbot (if any) and adding the new one. Then it sends the optional first message.
   * 
   * <b>Orchestration APIs</b> (Mashup of REST APIs)
   * 
   * @param {string} requestId - The request ID
   * @param {string} botAsPartecipantId - The bot id in the form 'bot_${botId}'.
   * @param {string} message - Optional. The first message to send as soon as the new bot is added to the conversation. This is used to trigger the greet message from the chatbot, if any is defined.
   * @param {resultCallback} callback - The callback that handles the response.
   */
  changeBotAndMessage(requestId, botAsPartecipantId, message, callback) {
    if (!requestId || !botAsPartecipantId) {
      callback({'message': 'botAsPartecipantId is undefined'});
      return;
    }
    this.getRequestById(requestId, (err, result) => {
      if (err) {
        callback({'message': 'getRequestById() error'});
      }
      const request = result;
      if (request.participantsBots && request.participantsBots.length > 0) {
        first_bot = request.participantsBots[0];
        let first_bot_id_as_partecipant = "bot_" + first_bot;
        this.deleteRequestParticipant(requestId, first_bot_id_as_partecipant, (err) => {
          this.addParticipantAndMessage(requestId, botAsPartecipantId, message, (err) => {
            if (err) {
              callback(err);
            }
            else {
              callback();
            }
          });
        });
      }
      else {
        this.addParticipantAndMessage(requestId, botAsPartecipantId, message, (err) => {
          if (err) {
            callback(err);
          }
          else {
            callback();
          }
        });
      }
    });
  }

  // private
  addParticipantAndMessage(requestId, botAsPartecipantId, message, callback) {
    this.addRequestParticipant(requestId, botAsPartecipantId, (err, result) => {
      if (err) {
        callback(err)
      }
      else {
        //console.log("partecipant added.", err);
        if (message) {
          this.sendSupportMessage(requestId, message, function(err) {
            if (err) {
              callback(err);
            }
            else {
              callback();
            }
          });
        }
      }
    });
  }

  // ****************************************************
  // *********************** BOTS ***********************
  // ****************************************************

  /**
   * Get all the bots defined in the project.<br>
   * <a href='https://developer.tiledesk.com/apis/rest-api/chat-bots/bots#get-all-bots' target='_blank'>REST API</a>
   * @param {resultCallback} callback - The callback that handles the response.
   */
  getAllBots(callback) {
    const URL = `${this.APIURL}/${this.projectId}/faq_kb`
    const HTTPREQUEST = {
      url: URL,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      // json: {member: participant},
      method: 'GET'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
      }, this.log
    );
  }

  /**
   * Get the first bot with the specified name in the project.<br>
   * <a href='https://developer.tiledesk.com/apis/rest-api/chat-bots/bots#get-all-bots' target='_blank'>REST API</a>
   *
   * @param {string} botName - The bot name.
   * @param {resultCallback} callback - The callback that handles the response.
   */
  findBotByName(botName, callback) {
    this.getAllBots((err, bots) => {
      if (err) {
        callback(err, null);
        return;
      }
      let bot_as_partecipant_id = null;
      for (i = 0; i < bots.length; i++) {
        const bot = bots[i];
        console.log(bot.description)
        const properties = JSON.parse(bot.description);
        if (properties && properties.name === name_match && bot.language === user_lang) {
          console.log("Bot found:", bot.name, bot._id);
          bot_as_partecipant_id = "bot_" + bot._id;
          break;
        }
      }
      if (bot_as_partecipant_id) {
        callback(null, err);
      }
    });
  }

  /**
   * Get bot by id.<br>
   * <a href='https://developer.tiledesk.com/apis/rest-api/chat-bots/bots#get-a-bot-by-id' target='_blank'>REST API</a>
   * @param {string} botId - The bot ID.
   * @param {resultCallback} callback - The callback that handles the response.
   */
   getBot(botId, callback) {
    const URL = `${this.APIURL}/${this.projectId}/faq_kb/${botId}`
    const HTTPREQUEST = {
      url: URL,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      // json: {member: participant},
      method: 'GET'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
      }, this.log
    );
  }

  /**
   * Create a bot.<br>
   * <a href='https://developer.tiledesk.com/apis/rest-api/chat-bots/bots#create-a-new-bot' target='_blank'>REST API</a>
   * @param {string} botName - The bot's name.
   * @param {boolean} isExternal - 'true' if you want an external bot.
   * @param {string} botUrl - The external bot's endpoint url.
   * @param {resultCallback} callback - The callback that handles the response.
   */
   createBot(botName, isExternal, botUrl, callback) {
    const URL = `${this.APIURL}/${this.projectId}/faq_kb`
    const HTTPREQUEST = {
      url: URL,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      json: {
        name: botName,
        external: isExternal,
        url: botUrl
      },
      method: 'POST'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
      }, this.log
    );
  }

  /**
   * Update a bot.<br>
   * <a href='https://developer.tiledesk.com/apis/rest-api/chat-bots/bots#update-a-bot' target='_blank'>REST API</a>
   * @param {string} botName - The bot's name.
   * @param {boolean} isExternal - 'true' if you want an external bot.
   * @param {string} botUrl - The external bot's endpoint url.
   * @param {resultCallback} callback - The callback that handles the response.
   */
   updateBot(botId, botName, isExternal, botUrl, callback) {
    const URL = `${this.APIURL}/${this.projectId}/faq_kb/${botId}`
    const HTTPREQUEST = {
      url: URL,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      json: {
        name: botName,
        external: isExternal,
        url: botUrl
      },
      method: 'PUT'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
      }, this.log
    );
  }

  /**
   * Delete a bot by id.<br>
   * <a href='https://developer.tiledesk.com/apis/rest-api/chat-bots/bots#delete-a-bot' target='_blank'>REST API</a>
   * @param {string} botId - The bot ID.
   * @param {resultCallback} callback - The callback that handles the response.
   */
   deleteBot(botId, callback) {
    const URL = `${this.APIURL}/${this.projectId}/faq_kb/${botId}`
    const HTTPREQUEST = {
      url: URL,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      // json: {member: participant},
      method: 'DELETE'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
      }, this.log
    );
  }

  // ***********************************************************
  // *********************** DEPARTMENTS ***********************
  // ***********************************************************

  /**
   * Create a new department.<br>
   * <a href='https://developer.tiledesk.com/apis/rest-api/management-api/departments#create-a-new-department' target='_blank'>REST API</a>
   * @param {string} name - The department's name.
   * @param {boolean} routing - (optional) The department routing type. Permitted values: 'assigned', 'pooled' (default).
   * @param {string} groupId - (optional) The group of users assigned to the department. If not provided the request will be routed through all available users
   * @param {string} botId - (optional) The bot assigned to the department, if any.
   * @param {resultCallback} callback - The callback that handles the response.
   */
   createDepartment(name, routing, groupId, botId, callback) {
    const URL = `${this.APIURL}/${this.projectId}/departments`
    const HTTPREQUEST = {
      url: URL,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      json: {
        name: name,
        routing: routing,
        id_group: groupId,
        id_bot: botId
      },
      method: 'POST'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
      }, this.log
    );
  }

  /**
   * Update a new department.<br>
   * <a href='https://developer.tiledesk.com/apis/rest-api/management-api/departments#update-a-department' target='_blank'>REST API</a>
   * @param {string} depId - The department's id.
   * @param {string} name - The department's name.
   * @param {boolean} routing - (optional) The department routing type. Permitted values: 'assigned', 'pooled' (default).
   * @param {string} groupId - (optional) The group of users assigned to the department. If not provided the request will be routed through all available users
   * @param {string} botId - (optional) The bot assigned to the department, if any.
   * @param {resultCallback} callback - The callback that handles the response.
   */
   updateDepartment(depId, name, routing, groupId, botId, callback) {
    const URL = `${this.APIURL}/${this.projectId}/departments/${depId}`
    const HTTPREQUEST = {
      url: URL,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      json: {
        name: name,
        routing: routing,
        id_group: groupId,
        id_bot: botId
      },
      method: 'PUT'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
      }, this.log
    );
  }

  /**
   * Get a department by id.<br>
   * <a href='https://developer.tiledesk.com/apis/rest-api/management-api/departments#get-a-department-by-id' target='_blank'>REST API</a>
   * @param {string} depId - The department ID.
   * @param {resultCallback} callback - The callback that handles the response.
   */
   getDepartment(depId, callback) {
    const URL = `${this.APIURL}/${this.projectId}/departments/${depId}`
    const HTTPREQUEST = {
      url: URL,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      // json: {member: participant},
      method: 'GET'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
      }, this.log
    );
  }

  /**
   * Get all the visible (aka active) departments defined in the project.<br>
   * <a href='https://developer.tiledesk.com/apis/rest-api/management-api/departments#get-all-active-departments' target='_blank'>REST API</a>
   * @param {resultCallback} callback - The callback that handles the response.
   */
   getDepartments(callback) {
    const URL = `${this.APIURL}/${this.projectId}/departments`
    const HTTPREQUEST = {
      url: URL,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      // json: {member: participant},
      method: 'GET'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
      }, this.log
    );
  }

  /**
   * Get all the deparments defined in the project.<br>
   * <a href='https://developer.tiledesk.com/apis/rest-api/management-api/departments#get-all-departments-active-or-hidden' target='_blank'>REST API</a>
   * @param {resultCallback} callback - The callback that handles the response.
   */
   getAllDepartments(callback) {
    const URL = `${this.APIURL}/${this.projectId}/departments/allstatus`
    const HTTPREQUEST = {
      url: URL,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      // json: {member: participant},
      method: 'GET'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
      }, this.log
    );
  }

  /**
   * Delete a department by id.<br>
   * <a href='https://developer.tiledesk.com/apis/rest-api/management-api/departments#delete-a-department' target='_blank'>REST API</a>
   * @param {string} depId - The department ID.
   * @param {resultCallback} callback - The callback that handles the response.
   */
   deleteDepartment(depId, callback) {
    const URL = `${this.APIURL}/${this.projectId}/departments/${depId}`
    const HTTPREQUEST = {
      url: URL,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      // json: {member: participant},
      method: 'DELETE'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
      }, this.log
    );
  }

  // ****************************************************
  // ****************** WIDGET SETTINGS *****************
  // ****************************************************

  /**
   * Returns the Widget settings for the selected project.
   * 
   * @param {resultCallback} callback - The callback that handles the response.
   */
  getWidgetSettings(callback, options) {
    // let token;
    // if (options && options.token) {
    //   token = options.token;
    // }
    // else if (this.token) {
    //   token = this.token;
    // }
    // else {
    //   throw new Error('token can NOT be null.');
    // }
    // let projectId;
    // if (options && options.projectId) {
    //   projectId = options.projectId;
    // }
    // else if (this.projectId) {
    //   projectId = this.projectId;
    // }
    // else {
    //   throw new Error('projectId can NOT be null.');
    // }
    // const jwt_token = TiledeskClient.fixToken(token)
    const HTTPREQUEST = {
      url: `${this.APIURL}/${this.projectId}/widgets`,
      method: 'GET',
      // json: true
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
        // if (response.status === 200) {
        //   if (callback) {
        //     callback(null, resbody)
        //   }
        // }
        // else if (callback) {
        //   callback(TiledeskClient.getErr(err, HTTPREQUEST, response, resbody), null);
        // }
      }, this.log
    );
  }

  /**
   * Returns the current opening status based on Opening Hours.
   * 
   * @param {resultCallback} callback - The callback that handles the response.<br>
   * <a href='https://developer.tiledesk.com/apis/rest-api/projects#return-if-the-project-is-open-regarding-operating-hours' target='_blank'>REST API</a>
   */
  openNow(callback) {
    // const jwt_token = TiledeskClient.fixToken(this.token)
    const url = `${this.APIURL}/projects/${this.projectId}/isopen`
    const HTTPREQUEST = {
      url: url,
      headers: {
       'Content-Type' : 'application/json'
       //  'Authorization': jwt_token
      },
      method: 'GET',
      // json: true
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
        // if (response.status === 200) {
        //     if (callback) {
        //       callback(null, resbody)
        //     }
        // }
        // else if (callback) {
        //   callback(TiledeskClient.getErr(err, HTTPREQUEST, response, resbody), null);
        // }
      }, this.log
    );
  }
  
  // ***************************************************
  // ****************** AUTHENTICATION *****************
  // ***************************************************

  /** Returns an anonymous user token to connect to a specific project's services.<br>
   * <a href='https://developer.tiledesk.com/apis/rest-api/authentication#anonymous-authentication-for-a-user.' target='_blank'>REST API</a>
   * @param {string} projectId - The projectId for this anonymous user.
   * @param {string} apikey - Your API key.
   * @param {Object} options - API call options.
   * @param {string} options.APIURL - Optional APIURL for connecting to a Tiledesk self-hosted instance.
   * @param {string} options.log - If true it logs HTTP request.
   * @param {resultCallback} callback - The callback that handles the response.
   */
  static anonymousAuthentication(projectId, apikey, options, callback) {
    if (!projectId) {
      throw new Error('projectId can NOT be null.');
    }
    if (!apikey) {
      throw new Error('apikey can NOT be null.');
    }
    let _log = false;
    if (options && options.log) {
      _log = options.log;
    }
    let _APIURL = TiledeskClient.DEFAULT_API_ENDPOINT;
    if (options && options.APIURL) {
      _APIURL = options.APIURL;
    }
    const HTTPREQUEST = {
      url: `${_APIURL}/auth/signinAnonymously`,
      headers: {
        'Content-Type' : 'application/json'
      },
      json: {
        "id_project": projectId
      },
      method: 'POST'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        // resbody example:
        // {
        //   "success": true,
        //   "token": "JWT eyJ...",
        //   "user": {
        //       "firstname": "Guest",
        //       "id": "20bb30db-b677-...",
        //       "fullName": "Guest "
        //   }
        // }
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
        // if (response.status === 200) {
        //   if (callback) {
        //     callback(null, resbody)
        //   }
        // }
        // else if (callback) {
        //   callback(TiledeskClient.getErr(err, HTTPREQUEST, response, resbody), null);
        // }
      }, _log
    );
  }

  /** Returns a Tiledesk token based on a custom token.<br>
   * See <a href='https://developer.tiledesk.com/apis/authentication'>JWT authentication</a> for more info.<br>
   * <a href='https://developer.tiledesk.com/apis/rest-api/authentication#authentication-with-email-and-password' target='_blank'>REST API</a>
   * @param {string} token - Your custom token.
   * @param {string} apikey - Your API key.
   * @param {Object} options - API call options.
   * @param {string} options.APIURL - Optional APIURL for connecting to a Tiledesk self-hosted instance.
   * @param {string} options.log - If true it logs HTTP request.
   * @param {resultCallback} callback - The callback that handles the response.
   */
  static customAuthentication(token, apikey, options, callback) {
    if (!apikey) {
      throw new Error('apikey can NOT be null.');
    }
    let _log = false;
    if (options && options.log) {
      _log = options.log;
    }
    let _APIURL = TiledeskClient.DEFAULT_API_ENDPOINT;
    if (options && options.APIURL) {
      _APIURL = options.APIURL;
    }
    const jwt_token = TiledeskClient.fixToken(token);
    const HTTPREQUEST = {
      url: `${_APIURL}/auth/signinWithCustomToken`,
      headers: {
        'Authorization' : jwt_token
      },
      // json: true,
      method: 'POST'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
        // if (response.status === 200) {
        //   if (callback) {
        //     callback(null, resbody)
        //   }
        // }
        // else if (callback) {
        //   callback(TiledeskClient.getErr(err, HTTPREQUEST, response, resbody), null);
        // }

      }, _log
    );
  }

  /** Returns a Tiledesk token to connect to Tiledesk services.
   * <a href='REST API' target='_blank'>https://developer.tiledesk.com/apis/rest-api/authentication#authentication-with-email-and-password</a>
   * @param {resultCallback} projectId - The projectId for this anonymous user.
   * @param {string} apikey - Your API key.
   * @param {Object} options - API call options.
   * @param {string} options.APIURL - Optional APIURL for connecting to a Tiledesk self-hosted instance.
   * @param {string} options.log - If true it logs HTTP request.
   * @param {resultCallback} callback - The callback that handles the response.
   */
  static authEmailPassword(apikey, email, password, options, callback) {
    if (!apikey) {
      throw new Error('apikey can NOT be null.');
    }
    let _log = false;
    if (options && options.log) {
      _log = options.log;
    }
    let _APIURL = TiledeskClient.DEFAULT_API_ENDPOINT;
    if (options && options.APIURL) {
      _APIURL = options.APIURL;
    }
    const HTTPREQUEST = {
      url: `${_APIURL}/auth/signin`,
      headers: {
        'Content-Type' : 'application/json'
      },
      json: {
        email: email,
        password: password
      },
      method: 'POST'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
        // if (response.status === 200) {
        //   if (callback) {
        //     callback(null, resbody)
        //   }
        // }
        // else if (callback) {
        //   callback(TiledeskClient.getErr(err, HTTPREQUEST, response, resbody), null);
        // }
      }, this.log
    );
  }

  // **********************************************
  // ****************** MESSAGING *****************
  // **********************************************

  /**
   * Sends a message to a support conversation.<br>
   * <a href='https://developer.tiledesk.com/apis/rest-api/messages#send-a-message.' target='_blank'>REST API</a>
   * 
   * @param {string} requestId - The request ID.
   * @param {chatMessage} message - The chat21's message JSON object.
   * @param {resultCallback} callback - The callback that handles the response.
   */
  sendSupportMessage(requestId, message, callback) {
    // const jwt_token = TiledeskClient.fixToken(this.token);
    const url = `${this.APIURL}/${this.projectId}/requests/${requestId}/messages`;
    const HTTPREQUEST = {
      url: url,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      json: message,
      method: 'POST'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
        // else if (callback) {
        //   console.log("callback here.")
        //   callback(TiledeskClient.getErr(err, HTTPREQUEST, response, resbody), null);
        // }
      }, this.log
    );
  }

  /**
   * The Chat21 message format. More on <a href='https://developer.tiledesk.com/widget/advanced/widget-json-protocol' target='_blank'>messages format (Review this link)</a>.
   * @typedef chatMessage
   * @type {Object}
   * @property {string} senderFullname - The sender full name
   * @property {string} recipient - The message recipiet's ID
   * @property {number} text - The message's text
   * @property {number} type - The message type. Allowed types are 'text' (default), 'image', 'frame'
   * @property {Object} metadata - The message's metadata. Some type as 'image' or 'frame' need metadata.
   * @property {Object} attributes - Custom attributes attacched to this message.
   */

  /**
   * Sends a message to a direct/group conversation.<br>
   * <a href='' target='_blank'>REST API</a>
   * 
   * @param {chatMessage} message - The chat21's message JSON object.
   * @param {resultCallback} callback - The callback that handles the response.
   */
  sendChatMessage(message, callback) {
    //const jwt_token = TiledeskClient.fixToken(this.token)
    const url = `${this.APIURL}/${this.projectId}/messages`;
    const HTTPREQUEST = {
      url: url,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      json: message,
      method: 'POST'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
        // if (err) {
        //   callback(TiledeskClient.getErr(err, HTTPREQUEST, response, resbody), null);
        // }
        // else if (response.status === 200) {
        //   if (callback) {
        //     callback(null, resbody)
        //   }
        // }
        // else if (callback) {
        //   callback(TiledeskClient.getErr(err, HTTPREQUEST, response, resbody), null);
        // }
      }, this.log
    );
  }

  // *******************************************
  // ****************** EVENTS *****************
  // *******************************************

  /**
   * Fire a new custom event and save it.<br>
   * With this endpoint you can fire a custom event. You event name should be of the form <i>event.emit.EVENT_NAME</i> to correctly identify your custom event.<br>
   * You can find the standard Tiledesk events here<br>
   * <a href='https://developer.tiledesk.com/apis/rest-api/events#fire-a-new-custom-event-and-save-it' target='_blank'>REST API</a>

   * @param {string} event 
   * @param {resultCallback} callback - The callback that handles the response.
   */
  fireEvent(event, callback) {
    // const jwt_token = TiledeskClient.fixToken(this.token)
    const HTTPREQUEST = {
      url: `${this.APIURL}/${this.projectId}/events`,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      json: event,
      method: 'POST'
   };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
          // if (response.status === 200) {
          //   if (callback) {
          //     callback(null, resbody)
          //   }
          // }
          // else if (callback) {
          //   callback(TiledeskClient.getErr(err, HTTPREQUEST, response, resbody), null);
          // }
      }, this.log
    );
  }
  
  // ******************************************
  // ****************** LEADS *****************
  // ******************************************

  /**
   * Updates a Lead's email and fullname.<br>
   * <a href='https://developer.tiledesk.com/apis/rest-api/leads#update-a-lead-by-id' target='_blank'>REST API</a>
   * 
   * @param {string} leadId - The Lead ID
   * @param {string} email - The new Lead email
   * @param {string} fullname - The new Lead fullname
   * @param {resultCallback} callback - The callback that handles the response.
   */
  updateLeadEmailFullname(leadId, email, fullname, callback) {
    if (!leadId) {
      throw new Error('leadId can NOT be null.');
    }
    //const jwt_token = TiledeskClient.fixToken(this.token);
    const HTTPREQUEST = {
      url: `${this.APIURL}/${this.projectId}/leads/${leadId}`, // this.conversation.lead._id
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      json: {
        email: email,
        fullname: fullname
      },
      method: 'PUT'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
        // if (response.status === 200) {
        //   if (callback) {
        //     callback(null, resbody)
        //   }
        // }
        // else if (callback) {
        //   callback(TiledeskClient.getErr(err, HTTPREQUEST, response, resbody), null);
        // }
      }, this.log
    );
  }

  // **********************************
  // ************ ROUTING *************
  // **********************************

  /**
 * This type is called `assignOptions` and is provided as options to apply to an assign method.
 *
 * @callback assignOptions
 * @param {boolean} nobot - If true, the department chatbot, if any, is ignored and the assign work on humans
 * @param {boolean} noPopulate - (esperimental) if true the request is left 'dry' (no additional metadata are added)
 */

  /**
   * Assign an agent to the specified department using the 'assing' method.<br>
   * 
   * @param {string} requestId - The request ID where applying the assignment
   * @param {string} email - The department ID where applying the assignment
   * @param {string} fullname - The new Lead fullname
   * @param {assignOptions} options - The options. If null default options apply
   * @param {resultCallback} callback - The callback that handles the response.
   */
  assign(requestId, departmentId, options, callback) {
    
    // const URL = `${this.API_ENDPOINT}/${project_id}/requests/${requestid}/assign`
    // var json = {
    //   departmentid: departmentid,
    //   nobot: true,
    //   no_populate: true
    // };
    // request({
    //   url: URL,
    //   headers: {
    //     'Content-Type' : 'application/json',
    //     'Authorization': 'JWT '+token
    //   },
    //   json: json,
    //   method: 'PUT'
    // },
    // function(err, response, resbody) {
    //   callback(err, resbody)
    // });

    const url = `${this.APIURL}/${this.projectId}/requests/${requestId}/assign`;
    var json = {
      departmentid: departmentId,
      nobot: false,
      no_populate: false
    };
    if (options && typeof options.nobot !== 'undefined' && options.nobot == true) {
      json.nobot = true
    }
    if (options && typeof options.noPopulate !== 'undefined' && options.noPopulate == true) {
      json.no_populate = true
    }
    const HTTPREQUEST = {
      url: url,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': this.jwt_token
      },
      json: json,
      method: 'PUT'
    };
    TiledeskClient.myrequest(
      HTTPREQUEST,
      function(err, resbody) {
        if (err) {
          if (callback) {
            callback(err);
          }
        }
        else {
          if (callback) {
            callback(null, resbody);
          }
        }
      }, this.log
    );
  }

  // ************************************************
  // ****************** HTTP REQUEST ****************
  // ************************************************

  static myrequest(options, callback, log) {
    if (log) {
      console.log("API URL:", options.url);
      console.log("** Options:", options);
    }
    axios(
      {
        url: options.url,
        method: options.method,
        data: options.json,
        headers: options.headers
      })
    .then(function (res) {
      if (log) {
        console.log("Response for url:", options.url);
        console.log("Response headers:\n", res.headers);
        console.log("******** Response for url:", res);
        console.log("Response body:\n", res.data);
      }
      if (res && res.status == 200 && res.data) {
        if (callback) {
          callback(null, res.data);
        }
      }
      else {
        if (callback) {
          callback(TiledeskClient.getErr({message: "Response status not 200"}, options, res), null, null);
        }
      }
    })
    .catch(function (error) {
      console.error("An error occurred:", error);
      if (callback) {
        callback(error, null, null);
      }
    });

    // request(
    //   {
    //     url: options.url,
    //     method: options.method,
    //     json: options.json,
    //     headers: options.headers
    //   },
    //   function(err, res, resbody) {
    //     if (log) {
    //       console.log("** For url:", options.url);
    //       console.log("** Options:", options);
    //       console.log("** Err:", err);
    //       console.log("** Response headers:\n", res.headers);
    //       console.log("** Response body:\n", res.body);
    //     }
    //     if (callback) {
    //       callback(err, res, resbody);
    //     }
    //   }
    // );
  }

  static getErr(err, request, response) {
    let res_err = {}
    res_err.http_err = err;
    res_err.http_request = request;
    res_err.http_response = response;
    return res_err;
  }

  static fixToken(token) {
    if (token.startsWith('JWT ')) {
      return token
    }
    else {
      return 'JWT ' + token
    }
  }

}

module.exports = { TiledeskClient };