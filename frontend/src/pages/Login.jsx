import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {

            const response = await axios.post(
                "http://localhost:8000/api/v1/users/login",
                {
                    email,
                    password
                },
                {
                    withCredentials: true
                }
            );

            console.log("Login successful:", response.data);
            localStorage.setItem(
            "accessToken",
            response.data.data.accessToken
);

            alert("Login successful!");

            // Login ke baad Home page
            navigate("/");

        } catch (error) {

            console.error("Login failed:", error);

            alert(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">

            <div className="border p-8 rounded-xl w-96">

                <h1 className="text-2xl font-bold mb-6">
                    Login
                </h1>

                <form onSubmit={handleLogin}>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border p-3 w-full mb-4 rounded"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border p-3 w-full mb-4 rounded"
                    />

                    <button
                        type="submit"
                        className="bg-black text-white p-3 w-full rounded"
                    >
                        Login
                    </button>

                </form>

                <p className="text-center mt-4">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-blue-600 font-semibold"
                    >
                        Register
                    </Link>
                </p>

            </div>

        </div>
    );
};

export default Login;