import { Input } from "@/components/ui/input";
import { Mail, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>(""); // Move useState inside the component
  const loading = false;

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <form className="flex flex-col gap-5 md:p-8 w-full max-w-md rounded-lg mx-4">
        <div className="text-center">
          <h1 className="font-extrabold text-2xl mb-2">Forgot Password</h1>
          <p className="text-sm text-gray-600 mb-4">
            Enter your email address to reset your password
          </p>
          <div className="relative">
            <Input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="pl-10"
            />
            <Mail className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
          </div>
          <div className=" mb-4 mt-4">
            {loading ? (
              <Button
                disabled
                className="w-full bg-orange hover:bg-hoverOrange"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </Button>
            ) : (
              <Button className="w-full bg-orange hover:bg-hoverOrange">
                Send Reset Link
              </Button>
            )}
            <div className="mt-4">
              <span className="text-center ">
                Back to{" "}
                <Link to="/login" className="text-blue-500 mt-4">
                  Login
                </Link>
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;