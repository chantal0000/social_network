import Profilepic from "./profilepic";
import BioEditor from "./bioEditor";
// also add bioEdtior
export default function Profile(props) {
    console.log("my props in profile", props);
    return (
        <div className="center" id="profile">
            <h1>Hey {props.first}, good to see you!</h1>
            <img id="profile-img" src={props.imageUrl || "/default.png"}></img>
            <h1>
                {props.first} {props.last}
            </h1>

            <div>
                <BioEditor bio={props.bio} setBio={props.setBio} />
            </div>
        </div>
    );
}
