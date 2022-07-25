// Reducer for messages ----------------------------------------
export default function messagesReducer(messages = [], action) {
    if (action.type === "messages/received") {
        messages = action.payload.messages;
        // messages = [...messages, action.payload.message];
        // console.log(messages);
        //...
    }
    if (action.type === "messages/new-message") {
        // console.log("I#m in message/new-message", action.payload.message);
        messages = [action.payload.message, ...messages];
        // messages = action.payload.message;
        console.log(messages);
    }
    return messages;
}

// Action Creators ---------------------------------------------
export function messagesReceived(messages) {
    return {
        type: "messages/received",
        payload: { messages },
    };
}

export function addNewMessage(message) {
    return {
        type: "messages/new-message",
        payload: { message },
    };
}
