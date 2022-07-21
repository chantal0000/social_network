import { BrowserRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import Reset from "./reset";
import Logo from "./logo";

export default function Welcome() {
    return (
        <div id="welcome">
            <h1>Welcome!</h1>
            <BrowserRouter>
                <Logo />
                <div>
                    <Route exact path="/">
                        <Registration />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/reset">
                        <Reset />
                    </Route>
                </div>
            </BrowserRouter>
        </div>
    );
}
