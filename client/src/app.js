import { Component } from "react";
import Logo from "./logo";
import { Link } from "react-router-dom";
// import Presentational from "./profilepic";
import Uploader from "./uploader";
import Profilepic from "./profilepic";
import Profile from "./profile";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import FindPeople from "./findPeople";
import OtherProfile from "./otherProfile";
import { Provider } from "react-redux";
import FriendsAndWannabees from "./friendsAndWannabees";
import Chat from "./chat";
// import sketch from "./sketch";
// import P5Wrapper from "react-p5-wrapper";
// import "./App.css";

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
        // console.log("newBio in app", newBio);
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
                // console.log("data in app.js", data);
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
        console.log("this state", this.state);
    }

    onUrlChange(newUrl) {
        console.log(
            "method is running in app and argument is passend:",
            newUrl
        );
        this.setState({ imageUrl: newUrl });
    }

    render() {
        return (
            <div>
                <BrowserRouter>
                    <section className="headerContainer">
                        {/* <Logo /> */}
                        <Profilepic
                            first={this.state.first}
                            last={this.state.last}
                            imageUrl={this.state.imageUrl || "/default.png"}
                            modalCallback={this.toggleModal}
                        />
                        <ul className="nav-container">
                            <li>
                                {" "}
                                <Link to="/">my profile</Link>{" "}
                            </li>
                            <li>
                                {" "}
                                <Link to="/find">find people</Link>{" "}
                            </li>

                            <li>
                                <Link to="/fwannabees">
                                    friends and future friends
                                </Link>{" "}
                            </li>
                            <li>
                                <Link to="messages">messages</Link>
                            </li>
                            {/* <li>
                                <Link to="sketch">sketch</Link>
                            </li> */}
                        </ul>
                    </section>
                    <Switch>
                        <Route exact path="/">
                            {this.state.uploaderIsVisible && (
                                <Uploader
                                    onUrlChange={this.onUrlChange}
                                    modalCallBack={this.toggleModal}
                                />
                            )}

                            {!this.state.uploaderIsVisible && (
                                <Profile
                                    first={this.state.first}
                                    last={this.state.last}
                                    imageUrl={this.state.imageUrl}
                                    bio={this.state.bio}
                                    setBio={this.setBio}
                                />
                            )}
                        </Route>
                        <Route path="/find">
                            <FindPeople />
                        </Route>
                        <Route path="/user/:otherUserId">
                            <OtherProfile />
                        </Route>
                        <Route path="/fwannabees">
                            <FriendsAndWannabees />
                        </Route>
                        <Route path="/messages">
                            <Chat />
                        </Route>
                        {/* <div>
                            <header className="app-header">
                                <>
                                    <P5Wrapper sketch={sketch} />
                                </>
                            </header>
                        </div> */}
                    </Switch>
                </BrowserRouter>
                <footer>
                    <button id="logout-btn">
                        <a href="/logout">Logout</a>
                    </button>
                </footer>
            </div>
        );
    }
}
