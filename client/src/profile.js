import Profilepic from "./profilepic";
import BioEditor from "./bioEditor";
// also add bioEdtior
export default function Profile(props) {
    console.log("my props in profile", props);
    return (
        <div>
            <h2>
                ___________________________________________________________________________
            </h2>
            <h2>This is the PROFILE componet.</h2>
            <h3>first name: {props.first}</h3>
            <h3>last name: {props.last}</h3>
            <img id="profile-img" src={props.imageUrl}></img>
            <BioEditor bio={props.bio} setBio={props.setBio} />
        </div>
    );
}
