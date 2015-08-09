(function() {
    if (!window.appId) {
        throw new Error("Please provide an App ID from your developer dashboard");
    }

    var layersample = {
        config: {
            serverUrl: window.serverUrl || "https://api.layer.com",
            appId: window.appId
        },
        headers: {
            Accept: "application/vnd.layer+json; version=1.0",
            Authorization: "",
            "Content-type": "application/json"
        },
        cache: {
            sampleConversationUrl: null
        }
    };


    /**
     * To get started, we must obtain a Nonce
     *
     * http://bit.ly/1xYNf7z#obtaining-a-nonce
     *
     * @method
     * @return {$.Deferred}
     */
    function getNonce() {
        var d = new $.Deferred();
        $.ajax({
            url: layersample.config.serverUrl + "/nonces",
            method: "POST",
            headers: layersample.headers
        })
        .done(function(data, textStatus, xhr) {
            d.resolve(data.nonce);
        });
        return d;
    }

    /**
     * Example of getting an identity token.
     *
     * Replace this function with whatever service you are
     * getting an Identity Token from.
     *
     * @method
     * @param  {string} nonce   Token is provided by REST server for use by identity provider
     * @return {$.Deferred}
     */
    function getIdentityToken(nonce) {
        var d = new $.Deferred();
        $.ajax({
            url: window.identityProvider +  "/identity_tokens",
            headers: {
                "X_LAYER_APP_ID": layersample.config.appId,
                "Content-type": "application/json",
                "Accept": "application/json"
            },
            method: "POST",
            data: JSON.stringify({
                app_id: layersample.config.appId,
                user_id: window.userIdMain,
                nonce: nonce
            })
        })
        .then(function(data, textStatus, xhr) {
            d.resolve(data.identity_token);
        });
        return d;
    }

    /**
     * Create a session using the identity_token
     *
     * http://bit.ly/1xYNf7z#authenticating-with-an-identity-token
     *
     * @method
     * @param  {string} identityToken   Identity token returned by your identity provider
     * @return {$.Deferred}
     */
    function getSession(identityToken) {
        var d = new $.Deferred();
        $.ajax({
            url: layersample.config.serverUrl + "/sessions",
            method: "POST",
            headers: layersample.headers,
            data: JSON.stringify({
                "identity_token": identityToken,
                "app_id": layersample.config.appId
            })
        })
        .then(function(data, textStatus, xhr) {
            d.resolve(data.session_token);
        });
        return d;
    }

    /**
     * Create a conversation
     *
     * http://bit.ly/1xYNf7z#creating-a-conversation
     *
     * @method
     * @param  {string[]} participants  Array of participant-ids
     * @return {$.Deferred}
     */
    function createConversation(participants) {
        return $.ajax({
            url: layersample.config.serverUrl + "/conversations",
            method: "POST",
            headers: layersample.headers,
            data: JSON.stringify({
                participants: participants,
                distinct: false,
                metadata: {
                    "background-color": "#aaaacc",
                    "is_favorite": "true",
                    "last_3_participants": {
                        "fred_baggins": "2015-06-22T16:47:42.127Z",
                        "frodo_flinstone": "2015-06-22T15:47:40.327Z",
                        "gandalf_of_oz": "2015-06-22T16:43:42.127Z"
                    }
                }
            })
        });
    }

    function enable_conversation_selectors() {
      $("a.conversation_selector").bind("click", function(e) {
        e.preventDefault();

        $("ul#chat").html("");

        layersample.cache.sampleConversationUrl = $(this).data("conversation-url");

        getMessages(layersample.cache.sampleConversationUrl)

        .then(function(messages) {
          var source   = $("#message-template").html();
          var template = Handlebars.compile(source);

          $.each( messages, function( index, message ){
            console.log(message);
            var context = {message_body: message.parts[0].body, received_at: moment(message.received_at).fromNow(), sender_id: message.sender.user_id};
            var html = template(context);

            $("ul#chat").append(html);
          });

          console.log("Messages loaded");
        });

      })
    }


    /**
     * Lists all Conversations
     *
     * http://bit.ly/1xYNf7z#listing-conversations
     *
     * @method
     * @return {$.Deferred}
     */
    function getConversations() {
        return $.ajax({
            url: layersample.config.serverUrl + "/conversations",
            method: "GET",
            headers: layersample.headers
        })
    }

    /**
     * Download description of a single Conversation
     *
     * http://bit.ly/1xYNf7z#listing-conversations
     *
     * @method
     * @param  {string} conversationUrl     URL of the requested resource
     * @return {$.Deferred}
     */
    function getOneConversation(conversationUrl) {
        return $.ajax({
            url: conversationUrl,
            method: "GET",
            headers: layersample.headers
        })
    }

    /**
     * Listing Messages in a Conversation:
     *
     * http://bit.ly/1xYNf7z#listing-messages-in-a-conversation
     *
     * @method
     * @param  {string} conversationUrl     URL of the requested resource
     * @return {$.Deferred}
     */
    function getMessages(conversationUrl) {
        return $.ajax({
            url: conversationUrl + "/messages",
            method: "GET",
            headers: layersample.headers
        })
    }

    /**
     * Retrieving a single Message
     *
     * http://bit.ly/1xYNf7z#retrieving-a-message
     *
     * @method
     * @param  {string} messageUrl      URL of the requested resource
     * @return {$.Deferred}
     */
    function getOneMessage(messageUrl) {
        return $.ajax({
            url: messageUrl,
            method: "GET",
            headers: layersample.headers
        })
    }

    /**
     * Sending a Message:
     *
     * http://bit.ly/1xYNf7z#sending-a-message
     *
     * This function sends only a single message part, but could easily be
     * adapted to send more.
     *
     * @method
     * @param  {string} conversationUrl     URL of the resource to operate upon
     * @param  {string} body                Message contents
     * @param  {string} mimeType            Mime type for the message contents (e.g. "text/plain")
     * @return {$.Deferred}
     */
    function sendMessage(conversationUrl, body, mimeType) {
        return $.ajax({
            url: conversationUrl + "/messages",
            method: "POST",
            headers: layersample.headers,
            data: JSON.stringify({
                parts: [{
                    body: body,
                    mime_type: mimeType
                }]
            })
        });
    }

    /**
     * Writing a Receipt for a Message (i.e. marking it as read or delivered)
     *
     * http://bit.ly/1xYNf7z#writing-a-receipt-for-a-message
     *
     * @method
     * @param  {string} messageUrl      URL of the resource to operate upon
     * @return {$.Deferred}
     */
    function markAsRead(messageUrl) {
        return $.ajax({
            url: messageUrl + "/receipts",
            method: "POST",
            headers: layersample.headers,
            data: JSON.stringify({type: "read"})
        });
    }

    /**
     * Delete a message/conversation from the server and all mobile clients
     *
     * http://bit.ly/1xYNf7z#deleting-a-message
     * http://bit.ly/1xYNf7z#deleting-a-conversation
     *
     * @method
     * @param  {string} resourceUrl      URL of the resource to operate upon
     * @return {$.Deferred}
     */
    function deleteResource(resourceUrl) {
        return $.ajax({
            url: resourceUrl + "?destroy=true",
            method: "DELETE",
            headers: layersample.headers
        });
    }

    function addRemoveParticipants(conversationUrl, addUsers, removeUsers) {
        var operations = [];
        addUsers.forEach(function(user) {
            operations.push({operation: "add", property: "participants", value: user});
        });

        removeUsers.forEach(function(user) {
            operations.push({operation: "remove", property: "participants", value: user});
        });

        return $.ajax({
            url: conversationUrl,
            method: "PATCH",
            headers: $.extend({}, layersample.headers, {
                "Content-Type": "application/vnd.layer-patch+json"
            }),
            data: JSON.stringify(operations)
        });
    }

    /**
     * Set and delete metadata keys/values from this conversation
     *
     * http://bit.ly/1xYNf7z#patching-metadata-structures
     *
     * @method
     * @param  {string} conversationUrl     URL of the conversation to update
     * @param  {object} metadataChanges     Any key in the object will be assign with the specified value.
     *                                      If the value is undefined, delete the key.
     * @return {$.Deferred}
     *
     * NOTE: Method is not recursive, so does not currently work on nested metadata keys
     */
    function patchConversationMetadata(conversationUrl, metadataChanges) {
        var operations = [];
        for (var key in metadataChanges) {
            if (metadataChanges.hasOwnProperty(key)) {
                var value = metadataChanges[key];
                if (value === undefined) {
                    operations.push({operation: "delete", property: "metadata." + key});
                } else {
                    operations.push({operation: "set", property: "metadata." + key, value: value});
                }
            }
        }

        return $.ajax({
            url: conversationUrl,
            method: "PATCH",
            headers: $.extend({}, layersample.headers, {
                "Content-Type": "application/vnd.layer-patch+json"
            }),
            data: JSON.stringify(operations)
        });
    }


    /**
     * This generates sample data.
     *
     * Sets up imageBlob variable with a blob.
     * More commonly you'll use
     *
     *     var fileInput = document.getElementById("myFileInput");
     *     var blob = fileInput.files[0];
     *
     * @method
     * @return {Blob}
     */


    // Get a nonce
    getNonce()

    // Use the nonce to get an identity token
    .then(function(nonce) {
      return getIdentityToken(nonce);
    })

    // Use the identity token to get a session
    .then(function(identityToken) {
      return getSession(identityToken);
    })

    // Store the sessionToken so we can use it in the header for our requests
    .then(function(sessionToken) {
      layersample.headers.Authorization =
              'Layer session-token="' + sessionToken + '"';
      // createConversation(["eee"]).then(function(conversation){
        // console.log(conversation);
      })
      enable_conversation_selectors();
    });

     $("#btn-chat").bind("click", function(e){
      e.preventDefault();
      var message_body = $("#btn-input").val();

      var source   = $("#message-template").html();
      var template = Handlebars.compile(source);

      sendMessage( layersample.cache.sampleConversation.url, message_body, "text/plain")

      .then(function(message) {
        console.log("Message added");

        var context = {message_body: message.parts[0].body, received_at: moment(message.received_at).fromNow(), sender_id: message.sender.user_id};
        var html = template(context);

        $("ul#chat").append(html);

      });

    });


})();