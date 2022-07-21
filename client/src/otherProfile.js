import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router";
import FriendButton from "./friendButton";
import { Link } from "react-router-dom";

export default function OtherProfile() {
    const [user, setUser] = useState({});
    const { otherUserId } = useParams(); // otherUserId <---- this name depends
    // on what you    called this inside your
    // path of the Route in app.js
    const history = useHistory();
    // console.log("history otherProfile", history);

    useEffect(() => {
        // console.log("otherProfile rendered");
        // console.log("otherUserId:", otherUserId);
        let abort = false;
        if (!abort) {
            // /user/:otherUserId

            fetch(`/api/user/${otherUserId}`)
                .then((resp) => resp.json())
                .then((data) => {
                    console.log("data", data);

                    if (data.myProfile) {
                        console.log("data.myProfile", data.myProfile);
                        history.push("/");
                    } else if (data.noResults) {
                        setUser(false);
                        console.log(data.noResults);
                    } else {
                        setUser(data.profile);
                    }
                })
                .catch((error) => {
                    console.log("error in fetch otherPeople", error);
                });
        }
        return () => {
            abort = true;
        };
    }, []);
    return (
        <>
            {!user && (
                <div>
                    <h3>no user found</h3>
                </div>
            )}
            {user && (
                <div>
                    <h3>
                        {user.first} {user.last}
                    </h3>
                    <img src={user.url} alt={`${user.first} ${user.last}`} />
                    <FriendButton otherUserId={otherUserId} />
                    <h3>{user.bio}</h3>
                </div>
            )}
        </>
    );
}
