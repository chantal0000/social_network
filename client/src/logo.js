import { Component } from "react";

export default class Logo extends Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        return <img id="logo" src="/logo.png" alt="logo" />;
    }
}
