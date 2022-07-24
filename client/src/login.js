import { Component } from "react";
import { Link } from "react-router-dom";

export default class Login extends Component {
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
        console.log(
            "LOGIN handleChange is running, user is changing inputfield"
        );
        console.log(e.target.value);
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
        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data from POST / login.json", data);
                // if registration was NOT successful --> render err conditionally
                if (data.error) {
                    // data.error
                    this.setState({ error: true });
                } else {
                    // - if true..., do that
                    // if registration was successful --> later...
                    console.log("login successful");
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
                <h1>LOG IN</h1>
                {this.state.error && (
                    <p className="err">Smth went wrong! LOGIN!</p>
                )}

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
                    Log in
                </button>
                <p>
                    not a member? <Link to="/">register</Link>
                </p>
                <p>
                    forgot your password?{" "}
                    <Link to="/reset">reset password</Link>
                </p>
            </div>
        );
    }
}
