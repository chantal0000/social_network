export default function Profilepic({ first, last, imageUrl, toggleModal }) {
    // console.log("info being passed down from App: ", imageUrl);
    imageUrl = imageUrl || "/default.png";

    return (
        <div>
            <h2>This is the Profilepic componet. WHAAAT</h2>
            {/* You need to use the first and last name of the user as the value of
            the alt attribute */}
            <img
                onClick={toggleModal}
                className="profile-pic"
                alt={(first, last)}
                src={imageUrl}
            />
        </div>
    );
}
