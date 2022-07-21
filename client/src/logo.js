import { Component } from "react";

export default class Logo extends Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <div>
                <img id="logo" src="/logo.png" alt="logo" />
            </div>
        );
    }
}
