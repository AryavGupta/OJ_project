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

      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login Failed!");
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4 transition-colors">
      {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={toggleTheme}
          className="h-10 w-10 p-0 border border-border hover:bg-muted"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      {/* Branding */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">Codeon</h1>
        <p className="text-muted-foreground mt-2">Your Online Coding Judge</p>
      </div>

      <Card className="w-full max-w-sm shadow-lg border border-border">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Login to Your Account
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background border-border focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background border-border focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Login
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Not registered yet?{" "}
              <Link 
                to="/register" 
                className="text-blue-600 dark:text-blue-400 underline hover:no-underline"
              >
                Register Here
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}