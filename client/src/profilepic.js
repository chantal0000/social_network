import { Component } from "react";

export default function Profilepic({ first, last, imageUrl, modalCallback }) {
    imageUrl = imageUrl || "/default.png";

    return (
        <div>
            <h2>This is the profilepic componet.</h2>
            <img
                onClick={modalCallback}
                className="profile-pic"
                src={imageUrl}
                alt={first + last}
            />
        </div>
    );
}
