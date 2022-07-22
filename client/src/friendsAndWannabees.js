import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
    makeFriend,
    makeUnfriend,
    receiveFriendsAndWannabees,
} from "./redux/friends/slice";

export default function FriendsAndWannabees() {
    // This gives you access to the dispatch function
    const dispatch = useDispatch();
    const wannabees = useSelector((state) => {
        return state.friends.filter((friend) => !friend.accepted);
    });

    const friends = useSelector((state) => {
        return state.friends.filter((friend) => friend.accepted);
    });
    // console.log("wtf- friends", friends);
    // console.log("wtf- wannabees", wannabees);

    useEffect(() => {
        // STEP 1 - make a GET request using fetch to retrieve the friends and wannabees
        (async () => {
            try {
                const resp = await fetch("/friends-wannabees");
                const data = await resp.json();
                console.log("data in fetch", data);

                // STEP 2 - once you have that data back, call dispatch and pass it an action to add this data to redux
                // you'll need to create and import the action creator below
                dispatch(receiveFriendsAndWannabees(data.friendsAndMore));
                console.log("friends", data.friendsAndMore);
            } catch (error) {
                console.log("error relationshop", error);
            }
        })();
    }, []);

    const handleClick = (id, type) => {
        (async () => {
            try {
                const resp = await fetch(`/api/friendshipButton/${id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ buttonText: type }),
                });
                const data = await resp.json();
                console.log("data recei where?", data);
                if (!data.error) {
                    if (type === "Accept friend request") {
                        dispatch(makeFriend(id));
                    }
                    if (type === "End Friendshiü") {
                        dispatch(makeUnfriend(id));
                    }
                }
            } catch (error) {
                console.log(error);
            }
        })();
        // STEP 1 - make a POST request to update the DB
        // STEP 2 - dispatch an action to update the global state
        // you'll need to create and import the action creator below
    };

    return (
        <section className="flexbox">
            <div>
                <h1>List of friends:</h1>
                {friends &&
                    friends.map((friend) => {
                        return (
                            <div key={friend.id}>
                                <img
                                    src={friend.url || "/default.png"}
                                    alt={`${friend.first} ${friend.last}`}
                                />

                                <h2>
                                    {" "}
                                    {friend.first} {friend.last}
                                </h2>
                                <button
                                    onClick={() =>
                                        handleClick(friend.id, "Unfriend")
                                    }
                                >
                                    Unfriend
                                </button>
                            </div>
                        );
                    })}
            </div>
            <div>
                <h1>Friend requests:</h1>
                {wannabees &&
                    wannabees.map((wannabee) => {
                        return (
                            <div key={wannabee.id}>
                                <img
                                    src={wannabee.url || "/default.png"}
                                    alt={`${wannabee.first} ${wannabee.last}`}
                                />
                                <h2>
                                    {" "}
                                    {wannabee.first} {wannabee.last}
                                </h2>
                                <button
                                    onClick={() =>
                                        handleClick(
                                            wannabee.id,
                                            "Accept Friend Request"
                                        )
                                    }
                                >
                                    Accept Friend Request
                                </button>
                            </div>
                        );
                    })}
            </div>
        </section>
    );
}
