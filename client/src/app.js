import { Component } from "react";
import Logo from "./logo";
import { Link } from "react-router-dom";
// import Presentational from "./profilepic";
import Uploader from "./uploader";
import Profilepic from "./profilepic";
import Profile from "./profile";
import { BrowserRouter, Route } from "react-router-dom";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first: "",
            last: "",
            imageUrl: "",
            bio: "",
            uploaderIsVisible: false,
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.onUrlChange = this.onUrlChange.bind(this);
        this.setBio = this.setBio.bind(this);
    }
    // you're going to want to create a method in app that is responsible for setting the official bio in App's state

    setBio(newBio) {
        this.setState({ bio: newBio });
        console.log("newBio in app", newBio);
        // the responsibility of this fn is to store this argument in Apps state
        // this function is created in App but needs to be called in BioEditor
        // it expects to be passed the official bio
        // make sure you log the argument to ensure you're actually getting it from BioEditor
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
                    bio: data.userInfo.bio,
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
                <BrowserRouter>
                    {/* <nav>
                        <Link to="/">Home</Link>
                    </nav> */}
                    <h1>APP says hello</h1>
                    <Logo />
                    <Profilepic
                        first={this.state.first}
                        last={this.state.last}
                        imageUrl={this.state.imageUrl}
                        modalCallback={this.toggleModal}
                    />
                    {this.state.uploaderIsVisible && (
                        <Uploader
                            onUrlChange={this.onUrlChange}
                            modalCallBack={this.toggleModal}
                        />
                    )}
                    <Profile
                        first={this.state.first}
                        last={this.state.last}
                        imageUrl={this.state.imageUrl}
                        bio={this.state.bio}
                        setBio={this.setBio}
                    />
                </BrowserRouter>
            </div>
        );
    }
}
