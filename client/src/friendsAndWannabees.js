import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { makeFriend } from "./redux/friends/slice";

export default function FriendsAndWannabees() {
    // This gives you access to the dispatch function
    const dispatch = useDispatch();

    // You are selecting Wannabees from the global state
    // before you target a property in state, make sure you know what it looks like!
    // const wannabees = useSelector(
    //     state) =>
    //         state.friends &&
    //         state.friends.filter((friend) => !friend.accepted)
    // );

    // console.log("wannabees: ", wannabees);

    // Make sure you select your "friends" from state using useSelector
    // .....

    // When component mounts, get all friends and wannabees
    useEffect(() => {
        // STEP 1 - make a GET request using fetch to retrieve the friends and wannabees
        // STEP 2 - once you have that data back, call dispatch and pass it an action to add this data to redux
        // you'll need to create and import the action creator below
        dispatch(receiveFriendsAndWannabees(yourDataFromServer));
    }, []);

    const handleAccept = (id) => {
        // STEP 1 - make a POST request to update the DB
        // STEP 2 - dispatch an action to update the global state
        // you'll need to create and import the action creator below
        dispatch(makeFriend(id));
    };

    return (
        <section>
            <h1>Friends</h1>
            {/* Display your friends */}

            <h1>Wannabees</h1>
            {wannabees.map((wannabee) => {
                return (
                    <div key={wannabee.id}>
                        <button onClick={() => handleAccept(wannabee.id)}>
                            Accept Friendship
                        </button>
                    </div>
                );
            })}
        </section>
    );
}
