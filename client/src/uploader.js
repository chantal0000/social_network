import { Component } from "react";

export default class Uploader extends Component {
    constructor() {
        super();
        this.state = {};
        this.handleUpload = this.handleUpload.bind(this);
    }
    // ADjust upload!!
    componentDidMount() {
        console.log("component uploader mounted");
    }
    handleUpload(e) {
        e.preventDefault();
        console.log("handleUpload");
        //register.json
        fetch("/upload", {
            method: "POST",
            body: new FormData(e.target),
        })
            .then((resp) => resp.json())
            .then((results) => {
                console.log("data from POST / updloader.json", results);
                // console.log("data in upload", results.data);
                this.props.onUrlChange(results.data);
            })
            .catch((err) => {
                console.log("error", err);
                this.setState({ error: true });
            });
    }

    render() {
        return (
            <div id="uploader">
                <h2>uploader for img</h2>
                <form onSubmit={this.handleUpload}>
                    <button id="button-close">X</button>
                    <input
                        id="upload-img"
                        name="image"
                        type="file"
                        accept="image/*"
                    ></input>
                    <button>submit</button>
                </form>
            </div>
        );
    }
}
