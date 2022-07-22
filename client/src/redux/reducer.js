import { combineReducers } from "redux";
import FriendsAndWannabeesReducer from "./friends/slice";
import messagesReducer from "./messages/slice";
// you need to import your friendsWannabeesReducer here!

const rootReducer = combineReducers({
    friends: FriendsAndWannabeesReducer,
    messages: messagesReducer,
});

export default rootReducer;
