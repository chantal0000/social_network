// function or class-component?
// we will use state so we choose class component

import { Component } from "react";
import { Link } from "react-router-dom";

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
    handleSubmit() {
        console.log("handleSubmit ");
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
                // if registration was NOT successful --> render err conditionally
                if (data.error) {
                    this.setState({ error: true });
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
    render() {
        return (
            <div className="center">
                <h1>SOCIAL NETWORK</h1>
                {this.state.error && (
                    <p className="err">Smth went wrong! try again PLEASE!</p>
                )}

                <input
                    onChange={this.handleChange}
                    name="first"
                    placeholder="First Name"
                    type="text"
                    className="inputbox"
                ></input>
                <input
                    // if you don't bind "THIS" above you can use onChange={(e) => this.handleChange(e)}
                    onChange={this.handleChange}
                    name="last"
                    placeholder="Last Name"
                    type="text"
                    className="inputbox"
                ></input>
                <input
                    onChange={this.handleChange}
                    name="email"
                    placeholder="E-Mail"
                    type="e-mail"
                    className="inputbox"
                ></input>
                <input
                    onChange={this.handleChange}
                    name="password"
                    placeholder="Password"
                    type="password"
                    className="inputbox"
                ></input>
                <button onClick={this.handleSubmit} className="reg-button">
                    register
                </button>
                <p>
                    already a member? <Link to="/login">log in</Link>
                </p>
            </div>
        );
    }
}
