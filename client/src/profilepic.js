import { Component } from "react";

export default function Profilepic({ first, last, imageUrl }) {
    // console.log("info being passed down from App: ", imageUrl);
    imageUrl = imageUrl || "/default.png";

    return (
        <div>
            <h2>
                This is the presentational componet. My name is {first}
                and my last name is {last}
            </h2>
            <img className="profile-pic" src={imageUrl} alt="Layla Arias" />
        </div>
    );
}
