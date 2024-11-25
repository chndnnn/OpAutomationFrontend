import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { globalState } from "../Context/GlobalContext";

const LoginScreen = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { setLoggedIn } = globalState();

  let nav = useNavigate();

  useEffect(() => {
    let data = localStorage.getItem("token");
    if (data) {
      nav("/home");
    }
  }, []);

  function onSubmitClick(e) {
    e.preventDefault();
    login();
  }

  async function login() {
    let data = {
      email,
      password,
    };
    try {
      let respose = await axios.post(
        "http://127.0.0.1:3001/opData/v1/login",
        data
      );
      if (respose) {
        localStorage.setItem("token", email);
        localStorage.setItem("client", respose.data.user.temp1);
        nav("/home");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>
        <form>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            onClick={onSubmitClick}
            className="w-full px-4 py-2 bg-black text-white font-medium rounded-lg hover:hover:text-yellow-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
