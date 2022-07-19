// PART 9 WITH REDUX
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

export default function Friends() {
    const dispatch = useDispatch();
    const wannabees = useSelector((state) =>
        state.friends.filter((friend) => !friend.accpeted)
    );
    // get all of our friends and wannabees when the component mounts
    useEffect(() => {
        // step 1 make a get request to fetch friends and wannbess
        // once you get your data back
        // step 2 dispatch an action creator and pass to it the data you just got back
        // this will start the proc3ess of adding your friends and wannbees
        //( an bif array of objects containing both)
        // dispatch(receiveFriends(your Data from server))
    });

    return (
        <section>
            <h1>Friends and wannabees component with redux</h1>
            <h1>people who want to be your friends</h1>
            {wannabees &&
                wannabees.map((wannabee) => {
                    return (
                        <div key={wannabee.id}>
                            <button>accpet friends</button>
                        </div>
                    );
                })}
        </section>
    );
}
