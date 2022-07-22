import { Component } from "react";

export default function Profilepic({ first, last, imageUrl, modalCallback }) {
    imageUrl = imageUrl || "/default.png";
    // console.log("imageURl", imageUrl);
    return (
        <div>
            {/* <h2>This is the profilePIC componet.</h2> */}
            <img
                onClick={modalCallback}
                className="profile-pic"
                src={imageUrl}
                alt={first + last}
            />
        </div>
    );
}
