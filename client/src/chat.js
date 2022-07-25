import { useSelector } from "react-redux";
import { socket } from "./socket";

export default function Chat() {
    const messages = useSelector((state) => state.messages);
    // console.log("Chat messages", messages);

    const keyCheck = (e) => {
        // console.log("what was pressed:", e.key);
        if (e.key === "Enter") {
            e.preventDefault();
            // console.log("what's the value of our input field", e.target.value);
            // time to let the server there is a new message
            socket.emit("new-message", e.target.value);
            // after emitting our msg, we clear the textarea
            e.target.value = "";
        }
    };
    return (
        <>
            <div className="center">
                <h1>LATEST MESSAGES</h1>
                <div className="container-chat">
                    {messages &&
                        messages.map((message) => {
                            return (
                                <p key={message.id}>
                                    <h2>
                                        {message.first} {""}
                                        {message.last}:
                                    </h2>
                                    {message.message}
                                </p>
                            );
                        })}
                </div>
                <textarea
                    className="inputbox"
                    onKeyDown={keyCheck}
                    placeholder="send new message"
                ></textarea>
                <button className="reg-button">send</button>
            </div>
        </>
    );
}
