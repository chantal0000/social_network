import Greetee from "./greetee";
import Counter from "./counter";
// if you dont add "default" you have to add {} when importing -> {HelloWorld}
export default function HelloWorld() {
    const myText = <h1>I love JSX</h1>;
    const myName = <h3>chantal munja bürger</h3>;
    const cohortName = "Cayenne";
    return (
        // to add class -> className is what class is in normal html
        <div className="some-class">
            <Greetee propName={cohortName} />
            <Greetee propName={"Merle"} />
            <Greetee />
            Hello, World!
            {myText}
            {myName}
            <h2>{2 + 28}</h2>
            <Counter />
        </div>
    );
}
