import { Component } from "react";
import { Link } from "react-router-dom";

export default class Reset extends Component {
    constructor() {
        super();
        this.state = {
            view: 1,
            error: false,
        };
        // bind "THIS"
        this.handleChange = this.handleChange.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
        this.passwordReset = this.passwordReset.bind(this);
        this.newPassword = this.newPassword.bind(this);
    }
    ///
    determineViewToRender() {
        // this method determines what the render!
        if (this.state.view === 1) {
            return (
                <div>
                    <h1>View 1: type in your e-mail please</h1>
                    <input
                        onChange={this.handleChange}
                        name="email"
                        placeholder="E-Mail"
                        type="e-mail"
                    />
                    <button onClick={this.passwordReset}>Send</button>
                    <p>
                        just kidding, I know my password! go back to:
                        <Link to="/login"> Log in</Link>
                    </p>
                </div>
            );
        } else if (this.state.view === 2) {
            return (
                <div>
                    <h1>
                        View 2: two inputs (reset code, new pw), & one button
                    </h1>
                    <input
                        onChange={this.handleChange}
                        name="reset_code"
                        placeholder="reset-code"
                        type="text"
                    />
                    <input
                        onChange={this.handleChange}
                        name="new_password"
                        placeholder="New Password"
                        type="password"
                    />
                    <button onClick={this.newPassword}>Send</button>
                </div>
            );
        } else if (this.state.view === 3) {
            // remember to also add a link to login ;)
            return (
                <div>
                    <h1>success msg & link back to Login!</h1>
                    <p>
                        <Link to="/login">Log in</Link>
                    </p>
                </div>
            );
        }
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
    // two methods not handelsubmit but like new pw
    passwordReset() {
        // should i send email somewhere here?
        console.log("passwordReset");
        //register.json

        fetch("password/reset/start", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data from POST / reset/start.json", data);
                // if registration was NOT successful --> render err conditionally
                if (data.error) {
                    // data.error
                    this.setState({ error: true });
                    console.log("error ");
                } else {
                    // - if true..., do that
                    // if registration was successful --> later...
                    console.log("reset successful");
                    // update.state
                    // this.setState update
                    this.setState({ error: false, view: 2 });
                }
            })
            .catch((error) => {
                console.log("error in passwordReset", error);
                this.setState({ error: true });
            });
    }
    newPassword(e) {
        console.log("newPW");
        //register.json
        fetch("/password/reset/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data from POST / reset/verify.json", data);
                // if registration was NOT successful --> render err conditionally
                if (data.error) {
                    // data.error
                    this.setState({ error: true });
                } else {
                    // - if true..., do that
                    // if registration was successful --> later...
                    console.log("reset successful");
                    //or just reload?
                    this.setState({ view: 3 });
                }
            })
            .catch((err) => {
                console.log("error", err);
                this.setState({ error: true });
            });
    }
    render() {
        return (
            <div>
                <h1>reset pw render</h1>
                {/* call the method */}
                {this.determineViewToRender()}
            </div>
        );
    }
}