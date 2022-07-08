// function component
// import Registration from "./registration";

// export default function Welcome() {
//     return (
//         <div>
//             <Registration />
//         </div>
//     );
// }

import { BrowserRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";

export default function Welcome() {
    return (
        <div id="welcome">
            <h1>Welcome!</h1>
            <img src="/logo.png" />
            <BrowserRouter>
                <div>
                    <Route exact path="/">
                        <Registration />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                </div>
            </BrowserRouter>
        </div>
    );
}