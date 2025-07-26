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
  const { setTheme, theme } = useTheme();

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
      alert("Registration successful!");
      navigate('/login');
    } catch (err) {
      console.error("Registration failed:", err);
      alert(err.response?.data?.message || "Something went wrong!");
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
            Create an Account
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-background border-border focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-background border-border focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
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
            
            <div>
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-background border-border focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Register
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already registered?{" "}
              <Link 
                to="/login" 
                className="text-blue-600 dark:text-blue-400 underline hover:no-underline"
              >
                Click to login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}