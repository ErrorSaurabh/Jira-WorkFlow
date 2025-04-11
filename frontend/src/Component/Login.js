import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Ct from "./Ct";
import '../css/Reg.css';

function Login() {
    const [data, setData] = useState({ email: "", password: "" });
    const [msg, setMsg] = useState("");
    const { updatestate } = useContext(Ct);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const add = async (e) => {
        e.preventDefault();

        if (data.email && data.password) {
            try {
                const res = await axios.post("http://localhost:5000/login", data);
                if (res.data.token) {
                    const userData = {
                        _id: res.data._id,
                        name: res.data.name,
                        role: res.data.role,
                        token: res.data.token
                    };
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('user', JSON.stringify(userData));

                    updatestate(userData);
                    setMsg("Login successful!");
                    navigate('/');
                } else {
                    setMsg(res.data.msg || "Login failed. Please try again.");
                }
            } catch (error) {
                setMsg("Login error. Please check your credentials and try again.");
                console.error("Login error:", error);
            }
        } else {
            setMsg("Please fill in all fields.");
        }
    }

    return (
        <div className="reg-container">
            <div className="form-side">
                <div className="join-container">
                    <h2 style={{ padding: "5pc 0px 20px 0px", fontWeight: "bold", color: "black" }}>User Login</h2>
                    <form className="form-container" onSubmit={add}>
                      
                        <input type="email" id="email" placeholder="Enter Email" name="email" value={data.email} onChange={handleChange} required />

                        <input type="password" id="password" placeholder="Enter Password" name="password" value={data.password} onChange={handleChange} required />

                        <button type="submit">Login</button>
                        {msg && <h2 className="message">{msg}</h2>}
                    </form>
                </div>
            </div>
            <div className="image-side"></div> 
        </div>
    );
}

export default Login;