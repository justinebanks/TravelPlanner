import { useRef } from "react";
import "../styles/login.css";

export default function Login() {
    console.log("LOGIN RERENDERED");
    const userInput = useRef<HTMLInputElement>(null)

    async function setUser() {
        if (userInput.current) {
            localStorage.setItem("user", userInput.current.value);
            window.location.pathname = "/";
        }
    }

    return (
        <div className="login">
            <h1>Login</h1>
            <input type="text" ref={userInput}/>
            <button onClick={setUser}>Submit</button>
        </div>
    )
}