import { Component } from "react";

// class NameOfClassComponent extends Component...

export default class Counter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
        };
        // we bind the "THIS" from here, and tell our incrementCount method
        // that its value of "this" is the one from up here
        this.incrementCount = this.incrementCount.bind(this);
    }
    componentDidMount() {
        console.log("counter just mounted");
    }
    incrementCount() {
        console.log("pressed button");
        // to interact with state in react we use special function called setState
        this.setState({
            count: this.state.count + 1,
        });
    }
    render() {
        return (
            <div>
                <h1>
                    I am the Counter | element created by the class Component
                </h1>
                <h2>current count is {this.state.count}</h2>
                <button onClick={this.incrementCount}>click to count</button>
            </div>
        );
    }
}
