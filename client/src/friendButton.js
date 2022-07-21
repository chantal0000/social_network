import { useState, useEffect } from "react";

export default function FriendButton(props) {
    const [buttonText, setButtonText] = useState("");

    useEffect(() => {
        // fetch reequest to find out relationship between users
        console.log("OtherUserID props", props.otherUserId);
        (async () => {
            try {
                const resp = await fetch(
                    `/api/relationship/` + props.otherUserId
                );
                const data = await resp.json();

                if (data.notFriends) {
                    setButtonText("Send Friend Request");
                } else if (data.accepted) {
                    setButtonText("End Friendship");
                } else if (
                    !data.accepted &&
                    data.sender_id == props.otherUserId
                ) {
                    setButtonText("Accept friend request");
                } else if (
                    !data.accepted &&
                    data.sender_id != props.otherUserId
                ) {
                    setButtonText("Cancel request");
                }
            } catch (error) {
                console.log("FriendButton error in fetch", error);
            }
        })();
    }, []);

    const handleFriendshipButton = () => {
        console.log("FRIENDS! button was pressed");
        console.log({ buttonText });

        try {
            (async () => {
                const resp = await fetch(
                    `/api/friendshipButton/` + props.otherUserId,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ buttonText }),
                    }
                );
                const data = await resp.json();

                // console.log("data.friendshipRequest", data.friendshipRequest);
                console.log("data", data);
                console.log("buttontext", data.buttonText);
                setButtonText(data.buttonText);
            })();
        } catch (error) {
            console.log("error in posting relationship", error);
        }
    };
    return (
        <div>
            <h1>this it the friend button component</h1>
            <div className="box-1">
                <button
                    className="btn btn-one"
                    onClick={() => handleFriendshipButton()}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
}
