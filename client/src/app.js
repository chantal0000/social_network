import { Component } from "react";
import Logo from "./logo";
// import Presentational from "./profilepic";
import Uploader from "./uploader";
import Profilepic from "./profilepic";
import Profile from "./profile";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            first: "",
            last: "",
            imageUrl: "",
            uploaderIsVisible: false,
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.onUrlChange = this.onUrlChange.bind(this);
    }
    componentDidMount() {
        console.log("App mounted1");
        // GET REQUEST TO SERVER first, Last, url
        // query in the server
        fetch("/user")
            .then((res) => res.json())
            .then((data) => {
                console.log("data in app.js", data);
                this.setState({
                    first: data.userInfo.first,
                    last: data.userInfo.last,
                    imageUrl: data.userInfo.url,
                });
            });
    }
    toggleModal() {
        console.log(" img toggleModal ist running");
        this.setState({
            // ! means do the oppposite of the state it is in
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    onUrlChange(newUrl) {
        console.log(
            "method is running in app and argument is passend:",
            newUrl
        );
        this.setState({ imageUrl: newUrl, uploaderIsVisible: false });
    }

    render() {
        return (
            <div>
                <h1>App says hello ggg</h1>
                <Logo />
                <Profilepic
                    first={this.state.first}
                    last={this.state.last}
                    imageUrl={this.state.imageUrl}
                    modalCallback={this.toggleModal}
                />
                {this.state.uploaderIsVisible && (
                    <Uploader onUrlChange={this.onUrlChange} />
                )}
                <Profile
                    first={this.state.first}
                    last={this.state.last}
                    imageUrl={this.state.imageUrl}
                />
            </div>
        );
    }
}
