import { Link } from "react-router-dom";
import {useState} from "react";
import axios from "axios";
const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState(null);
const [coverImage, setCoverImage] = useState(null);

 const handleRegister = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    formData.append("fullName", fullName);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);

    formData.append("avatar", avatar);

    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    const response = await axios.post(
      "http://localhost:8000/api/v1/users/register",
      formData
    );

    console.log("Registration successful:", response.data);

  } catch (error) {
    console.log(
      "Registration failed:",
      error.response?.data || error.message
    );
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="border p-8 rounded-xl w-96">

        <h1 className="text-2xl font-bold mb-6">
          Create Account
        </h1>

               <input
  type="text"
  placeholder="Full Name"
  className="border p-3 w-full mb-4 rounded"
  value={fullName}
  onChange={(e) => setFullName(e.target.value)}
/>
<input
  type="file"
  accept="image/*"
  className="border p-3 w-full mb-4 rounded"
  onChange={(e) => setAvatar(e.target.files[0])}
/>

<input
  type="file"
  accept="image/*"
  className="border p-3 w-full mb-4 rounded"
  onChange={(e) => setCoverImage(e.target.files[0])}
/>

        <input
          type="text"
          placeholder="Username"
          className="border p-3 w-full mb-4 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-3 w-full mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-3 w-full mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-black text-white p-3 w-full rounded " onClick={handleRegister}>
          Register
        </button>

      </div>
      <p className="text-center mt-4">
  Already have an account?{" "}
  <Link
    to="/login"
    className="text-blue-600 font-semibold"
  >
    Login
  </Link>
</p>

    </div>
  );
};

export default Register;