import { combineReducers } from "redux";
// you need to import your friendsWannabeesReducer here!

const rootReducer = combineReducers({
    friends: friendsWannabeesReducer,
});

export default rootReducer;
