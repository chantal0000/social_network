import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    useEffect(() => {
        let abort = false;
        (async () => {
            try {
                const respBody = await fetch("/findusers/" + searchInput);
                const data = await respBody.json();
                console.log("at find user data", data);
                if (!abort) {
                    setUsers(data);
                } else {
                    console.log("ignore");
                }
            } catch (error) {
                console.log("eroor at catch", error);
            }
        })();
        return () => {
            abort = true;
        };
    }, [searchInput]);
    return (
        <>
            <section className="center" id="findPeople">
                <h1>FIND PEOPLE</h1>
                <input
                    // className="search-input"
                    placeholder="find friends"
                    className="inputbox"
                    onChange={(e) => {
                        setSearchInput(e.target.value);
                    }}
                ></input>
                <ul className="list-people">
                    {users?.map((users, i) => {
                        return (
                            <li key={i}>
                                <Link to={`user/${users.id}`}>
                                    <img
                                        src={users.url || "/default.png"}
                                    ></img>
                                    <h4>
                                        {users.first} {users.last}
                                    </h4>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </section>
        </>
    );
}
