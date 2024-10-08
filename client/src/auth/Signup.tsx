import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-separator";
import { Loader2, LockKeyhole, Mail, Phone, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ChangeEvent, FormEvent } from "react";
import { SignupInputState, userSignupSchema } from "@/schema/userSchema";
import { useUserStore } from "@/store/useUserStore";

const Signup = () => {
  const [input, setInput] = useState<SignupInputState>({
    fullname: "",
    email: "",
    password: "",
    contact: "",
  });

  const [errors, setErrors] = useState<Partial<SignupInputState>>({});
  const { loading, signup } = useUserStore();
  //const loading = false;

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
    const result = userSignupSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<SignupInputState>);
      return;
    }
    //login api implementation start here
    // try {
    await signup(input);
    //  navigate("/verify-email");
    //} catch (error) {
    // console.log(error);
    //}
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
              type="text"
              placeholder="Full Name"
              name="fullname"
              value={input.fullname}
              onChange={changeEventHandler}
              className="pl-10 focus-visible:ring-1"
            />{" "}
            <User className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />{" "}
            {errors && (
              <span className="text-xs text-red-500">{errors.fullname}</span>
            )}
          </div>
        </div>
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
        <div className="mb-4">
          {" "}
          {/* Added mb-4 here */}
          <div className="relative">
            <Input
              type="password"
              placeholder="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              className="pl-10 focus-visible:ring-1"
            />
            <LockKeyhole className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
            {errors && (
              <span className="text-xs text-red-500">{errors.password}</span>
            )}
          </div>
        </div>
        <div className="mb-4">
          {" "}
          <div className="relative">
            <Input
              type="text"
              placeholder="Contact"
              name="contact"
              value={input.contact}
              onChange={changeEventHandler}
              className="pl-10 focus-visible:ring-1"
            />
            <Phone className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
            {errors && (
              <span className="text-xs text-red-500">{errors.contact}</span>
            )}
          </div>
        </div>
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
              Signup
            </Button>
          )}
        </div>{" "}
        <Separator className="my-4 h-px bg-gray-300" />{" "}
        <p className="mt-2 text-center">
          {" "}
          Already have an account ? {""}{" "}
          <Link to="/Login" className="text-blue-500">
            {" "}
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};
export default Signup;
