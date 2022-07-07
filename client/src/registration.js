// function or class-component?
// we will use state so we choose class component

import { Component } from "react";

export default class Registration extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };
        // bind "THIS"
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
        // console.log("handleChange is running, user is changing inputfield");
        // console.log(e.target.value);
        // add this to state
        this.setState(
            {
                // which input field by name : value that is put into specific input field
                [e.target.name]: e.target.value,
            }
            // () => console.log("this.state", this.state)
        );
    }
    handleSubmit(e) {
        console.log("handleSubmit");
        //register.json
        fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data from POST / register.json", data);

                // TO DO:
                // if registration was NOT successful --> render err conditionally
                if (data.error) {
                    this.setState({ error: data.error });
                } else {
                    // - if true..., do that
                    // if registration was successful --> later...
                    console.log("registration successful");
                    location.reload();
                }
            })
            .catch((err) => {
                console.log("error", err);
                this.setState({ error: true });
            });
    }

    // 1. render 4 input fields + a button
    // 2. capture the users input an dstore it state
    // 3. when the user submits, we want to send that data to the server
    // 4. if something goes wrong, condinitionally render err msg
    // 5. if everything goes well, show the logo
    render() {
        return (
            <div>
                <h1>welcome to this network</h1>
                {this.state.error && (
                    <p className="err">Smth went wrong! try again PLEASE!</p>
                )}

                <h1>this is the registration component</h1>
                <input
                    onChange={this.handleChange}
                    name="first"
                    placeholder="First Name"
                    type="text"
                ></input>
                <input
                    // if you don't bind "THIS" above you can use onChange={(e) => this.handleChange(e)}
                    onChange={this.handleChange}
                    name="last"
                    placeholder="Last Name"
                    type="text"
                ></input>
                <input
                    onChange={this.handleChange}
                    name="email"
                    placeholder="E-Mail"
                    type="e-mail"
                ></input>
                <input
                    onChange={this.handleChange}
                    name="password"
                    placeholder="Password"
                    type="password"
                ></input>
                <button onClick={this.handleSubmit}>Register</button>
            </div>
        );
    }
}
