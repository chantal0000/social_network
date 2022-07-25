import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
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
        <section className="center" id="fwannabee">
            <div>
                <h1>YOUR FRIENDS</h1>
                <div className="friends">
                    {friends &&
                        friends.map((friend) => {
                            return (
                                <div key={friend.id}>
                                    <Link to={`user/${friend.id}`}>
                                        <img
                                            src={friend.url || "/default.png"}
                                            alt={`${friend.first} ${friend.last}`}
                                        />
                                        <Link to={`user/${friend.id}`}></Link>
                                        <h2>
                                            {" "}
                                            {friend.first} {friend.last}
                                        </h2>
                                    </Link>
                                    <button
                                        className="reg-button"
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
            </div>
            <div>
                <h1>FRIEND REQUESTS</h1>
                <div className="wannabees">
                    {wannabees &&
                        wannabees.map((wannabee) => {
                            return (
                                <div key={wannabee.id}>
                                    <Link to={`user/${wannabee.id}`}>
                                        <img
                                            src={wannabee.url || "/default.png"}
                                            alt={`${wannabee.first} ${wannabee.last}`}
                                        />
                                        <h2>
                                            {" "}
                                            {wannabee.first} {wannabee.last}
                                        </h2>
                                    </Link>
                                    <button
                                        className="reg-button"
                                        onClick={() =>
                                            handleClick(
                                                wannabee.id,
                                                "Accept Friend Request"
                                            )
                                        }
                                    >
                                        accept friend request
                                    </button>
                                </div>
                            );
                        })}
                </div>
            </div>
        </section>
    );
}
