import { Component } from "react";
import Logo from "./logo";
// import Presentational from "./profilepic";
import Uploader from "./uploader";
import Profilepic from "./profilepic";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            first: "Layla",
            last: "Arias",
            imageUrl: "",
            uploaderIsVisible: false,
        };
        this.toggleModal = this.toggleModal.bind(this);
    }
    componentDidMount() {
        console.log("App mounted");
    }
    toggleModal() {
        console.log(" img toggleModal ist running");
        this.setState({
            // ! means do the oppposite of the state it is in
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    methodInApp(arg) {
        console.log("method is running in app and argument is passend:", arg);
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
                {this.state.uploaderIsVisible && <Uploader />}
            </div>
        );
    }
}
