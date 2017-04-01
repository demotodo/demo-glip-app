'use strict';

require('dotenv').config();

const GlipClient = require('glip-client');

const gc = new GlipClient({
    server: process.env.SERVER,
    appKey: process.env.APP_KEY,
    appSecret: process.env.APP_SECRET,
    appName: 'My Glip Client',
    appVersion: '1.0.0'
});

gc.authorize({
    username: process.env.PHONE,
    extension: process.env.EXTENSION,
    password: process.env.PASSWORD
}).then((response) => {
    console.log('logged in');

    var lastPostId = undefined;

    gc.posts().subscribe((message) => {
        console.log(message.messageType, message)

        if (message.type === 'TextMessage') {
            console.log("--- caught");

            if (message.id === lastPostId) {
                console.log("same as last response, skip it");
                return;
            }

            if (message.text === 'hello') {
                var responseMsg = {groupId: message.groupId, text: 'world'};
                console.log("[will post]: ", responseMsg);

                gc.posts().post(responseMsg)
                    .then(response => {
                        console.log("[post response]: ", response);
                        lastPostId = response.id;
                    });

            } else {
                var responseMsg = {groupId: message.groupId, text: 'unrecognized'};
                console.log("[will post]: ", responseMsg);

                gc.posts().post(responseMsg)
                    .then(response => {
                        console.log("[post response]: ", response);
                        lastPostId = response.id;
                    });
            }
        }
    });

});
