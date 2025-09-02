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
import { useForm } from "react-hook-form"
import { loginSchema, type LoginFormData } from "@/lib/schemas/loginSchema"
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import axios from "axios" 
import type { ErrorLoginResponse, LoginResponse } from "@/types/response"



export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
   
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post<LoginResponse>('http://127.0.0.1:8000/api/login', {
                email:  data.email,
                password:  data.password,
            });

            // Simpan token
            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");

        }  catch (err: any)  {
            // Cek apakah error memiliki response dari server
            if (err?.response?.data) {
                const errorData = err.response.data as ErrorLoginResponse;
                setError(errorData.message || "Login gagal.");
            } else if (err?.request) {
                // Request dibuat tapi tidak ada response (network error)
                setError("Terjadi kesalahan jaringan. Periksa koneksi internet Anda.");
            } else {
                // Error lainnya
                setError("Terjadi kesalahan yang tidak dikenal.");
            }
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
          <Form {...form}>
             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="user@example.com" type="email" disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Loading..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
