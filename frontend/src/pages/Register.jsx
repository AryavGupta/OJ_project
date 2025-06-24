// RegisterPage.jsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const {setTheme, theme} = useTheme();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await API.post('/auth/register', {
        name,
        username,
        email,
        password
      });
      console.log("Registration successful:", res.data);
      alert("Registration successful!");
      navigate('/login');
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Something went wrong!");
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
          <CardTitle className="text-center text-2xl font-bold">Create an Account</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              className="text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              className="text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              className="text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              className="text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              className="text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              Register
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already registered?{" "}
              <Link to="/login" className="text-primary underline">
                Click to login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}