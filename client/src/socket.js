import { io } from "socket.io-client";
import { messagesReceived, addNewMessage } from "./redux/messages/slice.js";
export let socket;

export const init = (store) => {
    if (!socket) {
        //only establish a socket connection once
        socket = io.connect();
        /* we'll later add all sorts of sockets that we want to listen to later on...*/
    }

    socket.on("last-10-messages", (msg) => {
        console.log("server just emitted last-10-messages", msg);
        // time to dispatch an action messages/received would be a good one
        // pass to action creator the messages your server emitted
        store.dispatch(messagesReceived(msg.messages));
    });

    socket.on("add-new-message", (msg) => {
        console.log("server just emitted a new msg to add", msg);
        // time to dispatch an ection message/addNew would be a good one
        // pass to action the object containing the message, and the user info
        // of the author
        store.dispatch(addNewMessage(msg));
    });
};
