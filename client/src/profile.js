import Profilepic from "./profilepic";
// also add bioEdtior
export default function Profile(props) {
    console.log("my props in profile", props);
    return (
        <div>
            <h2>
                ___________________________________________________________________________
            </h2>
            <h2>This is the profile componet.</h2>
            <h3>
                first name: {props.first} last name: {props.last}
            </h3>
            <img id="profile-img" src={props.imageUrl}></img>
        </div>
    );
}
