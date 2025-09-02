import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth"
import { Label } from "./ui/label"
import { api } from "@/services/api"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

      const { login } = useAuth();
      const navigate = useNavigate();

      const handleSubmit = async (e: React.FormEvent) => {
         e.preventDefault();
        setLoading(true);
        setError('');

        try {
          // Ganti dengan API call sesungguhnya
          const data = await api.post('/api/login', { 
              email, 
              password 
            });

            if (data.message === 'Login successful') {
              login(data.user, data.token);
              navigate('/');
            } else {
              setError(data.message || 'Login failed');
            }
          } catch (err: any) {
            setError('Login failed. Please check your credentials.');
            console.error('Login error:', err);
          } finally {
            setLoading(false);
          }
      }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="gap-2 text-center">
          <CardTitle className="text-2xl  font-semibold">Welcome to Restaurant Apps</CardTitle>
          <CardDescription>
            you can control the reserved customer in here
          </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
                {error && <div className="error">{error}</div>}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={loading}>
                   {loading ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
