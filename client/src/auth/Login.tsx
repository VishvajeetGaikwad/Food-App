import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-separator";
import { Loader2, LockKeyhole, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChangeEvent, FormEvent } from "react";
import { LoginInputState, userLoginSchema } from "@/schema/userSchema";
import { useUserStore } from "@/store/useUserStore";

// type LoginInputState = {
//   email: string;
//   password: string;
// };

const Login = () => {
  const [input, setInput] = useState<LoginInputState>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginInputState>>({});
  const { login, loading } = useUserStore();
  const navigate = useNavigate();

  const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  };

  const loginSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    // form validation check start
    const result = userLoginSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<LoginInputState>);
      return;
    }

    try {
      await login(input);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min h-screen">
      {" "}
      <form
        onSubmit={loginSubmitHandler}
        className="md:p-8 w-full max-w-md md:border border-gray-200 rounded-lg mx-4 "
      >
        {" "}
        <div className="mb-4">
          {" "}
          <h1 className="font-bold text-2xl text-center"> PatelEats</h1>
        </div>{" "}
        <div className="mb-4">
          {" "}
          <div className="relative">
            {" "}
            <Input
              type="email"
              placeholder="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              className="pl-10 focus-visible:ring-1"
            />{" "}
            <Mail className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />{" "}
            {errors && (
              <span className="text-xs text-red-500">{errors.email}</span>
            )}
          </div>
        </div>
        <div>
          {" "}
          <div className="relative">
            {" "}
            <Input
              type="password"
              placeholder="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              className="pl-10 focus-visible:ring-1"
            />{" "}
            <LockKeyhole className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />{" "}
            {errors && (
              <span className="text-xs text-red-500">{errors.password}</span>
            )}
          </div>
        </div>{" "}
        <div className="mb-8 mt-4">
          {" "}
          {loading ? (
            <Button disabled className="w-full bg-orange hover:bg-hoverOrange">
              {" "}
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full bg-orange hover:bg-hoverOrange"
            >
              {" "}
              Login
            </Button>
          )}
          <div className="mt-4 text-blue-500 hover:underline text-center">
            <Link to="/forgot-password"> Forgot Password</Link>
          </div>
        </div>{" "}
        <Separator className="my-4 h-px bg-gray-300" />{" "}
        <p className="mt-2 text-center">
          {" "}
          Dont have an account ? {""}{" "}
          <Link to="/signup" className="text-blue-500">
            {" "}
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
};
export default Login;
