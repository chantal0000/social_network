import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";

// ReactDOM.render(<Welcome />, document.querySelector("main"));

fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        if (!data.user_id) {
            // this means that the user doens't have a userId and should see Welcome/Registration for now
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            console.log("user_id", data.user_id);
            // this means the user is registered cause their browser DID have the right cookie and they should be seeing a logo
            ReactDOM.render(<App />, document.querySelector("main"));
        }
    });
