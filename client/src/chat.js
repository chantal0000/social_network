import { useSelector } from "react-redux";
import { socket } from "./socket";

export default function Chat() {
    const messages = useSelector((state) => state.messages);
    console.log("Chat messages", messages);

    const keyCheck = (e) => {
        // console.log("what was pressed:", e.key);
        if (e.key === "Enter") {
            e.preventDefault();
            console.log("what's the value of our input field", e.target.value);
            // time to let the server there is a new message
            socket.emit("new-message", e.target.value);
            // after emitting our msg, we clear the textarea
            e.target.value = "";
        }
    };
    return (
        <>
            <h1>Welcome to Chat</h1>
            <div className="container-chat">
                {messages &&
                    messages.map((message) => {
                        return (
                            <p key={message.id}>
                                {message.first}
                                {message.last}:{message.message}
                            </p>
                        );
                    })}
            </div>
            <textarea
                onKeyDown={keyCheck}
                placeholder="send new message"
            ></textarea>
            <button>send</button>
        </>
    );
}
