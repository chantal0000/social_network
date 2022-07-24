import { Component } from "react";

export default class BioEditor extends Component {
    constructor() {
        super();
        this.state = { showTextArea: false, draftBio: "" };
        this.handleBioChange = this.handleBioChange.bind(this);
        this.submitBio = this.submitBio.bind(this);
        this.editBio = this.editBio.bind(this);
    }
    componentDidMount() {
        console.log("uploader just mounted");
    }

    handleBioChange(e) {
        // in here, you want to keep track of the draft bio that the user types
        console.log("handleBioChange");
        console.log(e.target.value);
        // console.log("draftBio", draftBio);
        this.setState({
            // which input field by name : value that is put into specific input field
            [e.target.name]: e.target.value,
        });

        // store whatever that value is in bioEditor's state as the 'draftBio'
    }
    editBio() {
        this.setState({
            showTextArea: true,
            draftBio: this.props.bio,
        });
    }
    submitBio() {
        // e.preventDefault();
        console.log("submitBio");
        //register.json
        fetch("/updateBio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
            // body: new FormData(e.target),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(
                    "data from POST / updateBio HIHIH",
                    data.updatedBio.bio
                );
                // this.state.draftBio;
                console.log("data.updatedBio.bio", data);
                this.props.setBio(data.updatedBio.bio);
                this.setState({
                    showTextArea: false,
                });
            })
            .catch((err) => {
                console.log("error ccc", err);
                this.setState({ error: true });
            });
        // this should run whenever the user clicks save / submit (whenever they're done writing their bio)
        // TODO:
        // 1. make a fetch POST request and send along the draftbio the user typed (this.state.draftBio)
        // 2. make sure you send the newly inserted bio from the server back to bioEditor
        // 3. once you see it, make sure you send this newly inserted bio back to APP as this newly inserted bio / official bio will live in the state of App
        // the bio that lives in App's state is the official one ✅
        // you can do something like -> this.props.setBio(newBio)
    }
    render() {
        return (
            <div>
                {this.state.showTextArea && (
                    <div>
                        <input
                            name="draftBio"
                            value={this.state.draftBio}
                            onChange={this.handleBioChange}
                        ></input>
                        <button onClick={this.submitBio}>save</button>
                    </div>
                )}
                {!this.state.showTextArea && this.props.bio && (
                    <div className="editBio">
                        <h3>{this.props.bio}</h3>
                        <button onClick={this.editBio}>edit</button>
                    </div>
                )}
                {!this.state.showTextArea && !this.props.bio && (
                    <div className="addBio">
                        <button onClick={this.editBio}>add your bio</button>
                    </div>
                )}
            </div>
            //  Do your rendering logic in here!
            // It all depends on whether you are on edit more or not.
            // Whenever they click on the add or edit button, you are on edit mode - show the text area!

            // If showTextArea is true, then render the text area with a button that says save / submit
            // If you're not adding or editing a bio, then you should NOT see the text area
            // If you're NOT in edit mode, THEN check to see if there is a bio!

            // if there is a bio, allow them to EDIT a bio!
            // if there is NO bio, allow them to ADD a bio!
        );
    }
}
