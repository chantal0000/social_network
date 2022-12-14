import { Component } from "react";

export default class Uploader extends Component {
    constructor(props) {
        console.log("props in uploader", props);
        super(props);
        this.state = {};
        this.handleUpload = this.handleUpload.bind(this);
    }
    // ADjust upload!!
    componentDidMount() {
        // console.log("component uploader mounted");
    }
    handleUpload(e) {
        e.preventDefault();
        // console.log("handleUpload");
        //register.json
        fetch("/upload", {
            method: "POST",
            body: new FormData(e.target),
        })
            .then((res) => res.json())
            .then((results) => {
                // console.log("data from POST / updloader.json", results);
                console.log("data in upload", results.data);
                this.props.onUrlChange(results.data);
                this.props.modalCallBack();
            })
            .catch((err) => {
                console.log("error", err);
                this.setState({ error: true });
            });
    }

    render() {
        return (
            <div id="uploader">
                <h2 className="closeModal" onClick={this.props.modalCallBack}>
                    X
                </h2>

                <form onSubmit={this.handleUpload}>
                    <input
                        id="upload-img"
                        name="image"
                        type="file"
                        accept="image/*"
                    ></input>

                    <button className="reg-button">upload new pic</button>
                </form>
            </div>
        );
    }
}
