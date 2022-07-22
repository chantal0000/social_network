// Reducer for messages ----------------------------------------
export default function messagesReducer(messages = [], action) {
    if (action.type === "messages/received") {
        messages = action.payload.messages;
        console.log(messages);
        //...
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

// export function addNewMessage(message) {
//     //...
// }
