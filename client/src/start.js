import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";
import { createStore, applyMiddleware } from "redux";
import * as immutableState from "redux-immutable-state-invariant";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";
import rootReducer from "./redux/reducer";
import { init } from "./socket";

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(immutableState.default()))
);

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
            init(store);
            ReactDOM.render(
                <Provider store={store}>
                    <App />
                </Provider>,

                document.querySelector("main")
            );
        }
    });
