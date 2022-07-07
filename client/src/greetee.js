export default function Greetee(props) {
    console.log("greetee here");
    console.log("props:", props);
    return <h2>GREETEE {props.propName || "stranger"}</h2>;
}
