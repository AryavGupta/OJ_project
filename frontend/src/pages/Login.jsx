import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import API from "../services/api";

import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/authSlice';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      dispatch(setCredentials({
      user: res.data.user,
      token: res.data.token,
    }));

      // localStorage.setItem("token", res.data.token);
      // setUser({ token: res.data.token });
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login Failed!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted text-foreground px-4">
      <div className="absolute top-4 right-4">
        <Button variant="ghost" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun /> : <Moon />}
        </Button>
      </div>

      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Login to Your Account</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              className="bg-white dark:bg-neutral-900 text-black dark:text-white placeholder:text-gray-450"
              // className="bg-muted text-foreground"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              />
            <Input
              className="bg-white dark:bg-neutral-900 text-black dark:text-white placeholder:text-gray-450" 
              // className="bg-muted text-foreground"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" className="w-full">
              Login
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Not registered yet?{" "}
              <Link to="/register" className="text-primary underline">
                Register Here
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
