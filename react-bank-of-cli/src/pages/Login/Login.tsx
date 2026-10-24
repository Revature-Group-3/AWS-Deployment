import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { popToast } from "@/lib/popToast";
import { isValidEmail, isValidName, isValidPassword } from "@/utils/validation";
import { usePageTitle } from "@/hooks/usePageTitle";
import { ApiError } from "@/api";

//todo: get email validation working
//todo: email already exists validation

const Login = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [loginFailed, setLoginFailed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Validated Error States
  const [invalidFirst, setInvalidFirst] = useState(false);
  const [invalidLast, setInvalidLast] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  usePageTitle(`${isSigningUp ? "Sign Up" : "Sign In"} | Bank of CLI`);

  const { login, signup } = useAuth();

  const handleSubmitSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginFailed(false);
    setIsLoading(true);
    try {
      await login(email, password);
      setEmail("");
      setPassword("");
      // TODO: Navigate to dashboard here
    } catch (err) {
      setLoginFailed(true);
      popToast(false, "", err instanceof ApiError ? err.message : "Could not reach the server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (invalidFirst || invalidLast || invalidEmail || invalidPassword || password !== confirmPassword) return;
    setIsLoading(true);
    try {
      await signup(email, firstName, lastName, password);
      popToast(true, "Account Creation Successful!", "");
      clearAllFields();
      setIsSigningUp(false);
    } catch (err) {
      popToast(false, "", err instanceof ApiError ? err.message : "Could not reach the server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSwap = () => {
    clearAllFields();
    setIsSigningUp(!isSigningUp);
  };

  const clearAllFields = () => {
    setLoginFailed(false);
    setPassword("");
    setEmail("");
    setFirstName("");
    setLastName("");
    setConfirmPassword("");
    setInvalidFirst(false);
    setInvalidLast(false);
    setInvalidEmail(false);
    setInvalidPassword(false);
    setPasswordMismatch(false);
  };

  const handleFirst = () => {
    if (!firstName || isValidName(firstName)) setInvalidFirst(false);
    else setInvalidFirst(true);
  };

  const handleLast = () => {
    if (!lastName || isValidName(lastName)) setInvalidLast(false);
    else setInvalidLast(true);
  };

  const handleEmail = () => {
    if (!email || isValidEmail(email)) setInvalidEmail(false);
    else setInvalidEmail(true);
  };

  const handlePassword = () => {
    if (confirmPassword !== "" && password !== confirmPassword) setPasswordMismatch(true);
    else setPasswordMismatch(false);
    if (password === "" && confirmPassword === "") setPasswordMismatch(false);
    if (password === "" || confirmPassword === "") setInvalidPassword(false);

    if (isValidPassword(password)) setInvalidPassword(false);
    else setInvalidPassword(true);
  };

  return (
    <>
      <div className="redbg h-10"></div>
      <div className="flex min-h-screen items-center flex-col justify-center bg-muted/40 p-4">
      <h1 className="text-center font-serif p-4 text-[28px] text-primary font-medium">Bank of CLI</h1>
        <div className="h-2 redbg"></div>
        {!isSigningUp ? (
          <Card className="w-full max-w-sm border-t-4 border-primary rounded-t-none">
            <CardHeader>
              <CardTitle className="text-center text-xl font-serif">Sign in</CardTitle>
            </CardHeader>

            <Separator />

            <CardContent>
              <form id="login-form" onSubmit={handleSubmitSignIn}>
                <div className="flex flex-col gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      className="border-neutral-400 h-10 dark:border-neutral-200 focus-visible:ring-neutral-900"
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading ? true : false}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      className="border-neutral-400 h-10 focus-visible:ring-neutral-900"
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading ? true : false}
                    />
                  </div>
                </div>
              </form>

              <Alert className="border-none px-0" variant="destructive">
                <AlertTitle className={loginFailed ? "" : "hidden"}>Invalid email or password</AlertTitle>
              </Alert>
            </CardContent>

            <CardFooter className="flex-col gap-4">
              <Button
                type="submit"
                form="login-form"
                className="w-full p-6 text-sm font-bold"
                disabled={isLoading ? true : false}
              >
                {isLoading && <Spinner className="size-6" />}
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>

              <div className="flex w-full items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs">OR</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <p className="text-sm">
                Don't have an account?{" "}
                <Button
                  className="underline cursor-pointer"
                  onClick={handleFormSwap}
                  variant="link"
                  disabled={isLoading ? true : false}
                >
                  Create an account
                </Button>
              </p>
            </CardFooter>
          </Card>
        ) : (
          <Card className="w-full max-w-sm border-t-4 border-primary rounded-t-none">
            <CardHeader>
              <CardTitle className="text-center text-xl font-serif">Create an account</CardTitle>
            </CardHeader>

            <Separator />

            {/* SIGN UP */}

            <CardContent>
              <form id="signup-form" onSubmit={handleSubmitSignUp}>
                <div className="flex flex-col gap-3">
                  {/* EMAIL */}

                  <div className="grid gap-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      onBlur={handleEmail}
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading ? true : false}
                      className={
                        invalidEmail
                          ? "border-red-500 h-10 dark:border-neutral-200 focus-visible:ring-neutral-900"
                          : "border-neutral-400 h-10 dark:border-neutral-200 focus-visible:ring-neutral-900"
                      }
                    />
                    {invalidEmail && (
                      <Alert className="border-none p-0" variant="destructive">
                        <AlertTitle>Email must be valid</AlertTitle>
                      </Alert>
                    )}
                  </div>

                  {/* FIRST NAME */}

                  <div className="grid gap-1">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      onBlur={handleFirst}
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      disabled={isLoading ? true : false}
                      className={
                        invalidFirst
                          ? "border-red-500 h-10 dark:border-neutral-200 focus-visible:ring-neutral-900"
                          : "border-neutral-400 h-10 dark:border-neutral-200 focus-visible:ring-neutral-900"
                      }
                    />
                    {invalidFirst && (
                      <Alert className="border-none p-0" variant="destructive">
                        <AlertTitle>
                          First name must be less than 24 characters and contain only letters and - (hyphen) or '
                          (apostrophe)
                        </AlertTitle>
                      </Alert>
                    )}
                  </div>

                  {/* LAST NAME */}

                  <div className="grid gap-1">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      onBlur={handleLast}
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      disabled={isLoading ? true : false}
                      className={
                        invalidLast
                          ? "border-red-500 h-10 dark:border-neutral-200 focus-visible:ring-neutral-900"
                          : "border-neutral-400 h-10 dark:border-neutral-200 focus-visible:ring-neutral-900"
                      }
                    />
                    {invalidLast && (
                      <Alert className="border-none p-0" variant="destructive">
                        <AlertTitle>
                          Last name must be less than 24 characters and contain only letters and - (hyphen) or '
                          (apostrophe)
                        </AlertTitle>
                      </Alert>
                    )}
                  </div>

                  {/* PASSWORD */}

                  <div className="grid gap-1">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      onBlur={handlePassword}
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading ? true : false}
                      className={
                        invalidPassword || passwordMismatch
                          ? "border-red-500 h-10 dark:border-neutral-200 focus-visible:ring-neutral-900"
                          : "border-neutral-400 h-10 dark:border-neutral-200 focus-visible:ring-neutral-900"
                      }
                    />
                  </div>

                  {/* CONFIRM PASSWORD */}

                  <div className="grid gap-1">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      onBlur={handlePassword}
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading ? true : false}
                      className={
                        invalidPassword || passwordMismatch
                          ? "border-red-500 h-10 dark:border-neutral-200 focus-visible:ring-neutral-900"
                          : "border-neutral-400 h-10 dark:border-neutral-200 focus-visible:ring-neutral-900"
                      }
                    />
                  </div>

                  {passwordMismatch && (
                    <Alert className="border-none p-0" variant="destructive">
                      <AlertTitle>Passwords do not match</AlertTitle>
                    </Alert>
                  )}

                  {invalidPassword && (
                    <Alert className="border-none p-0" variant="destructive">
                      <AlertTitle>
                        Password must be between 8-32 characters, with letters, numbers, and the symbols !, # or _{" "}
                      </AlertTitle>
                    </Alert>
                  )}
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex-col gap-4">
              <Button
                type="submit"
                form="signup-form"
                className="w-full p-6 text-sm font-bold"
                disabled={isLoading ? true : false}
              >
                {isLoading && <Spinner className="size-6" />}
                {isLoading ? "Signing up..." : "Sign up"}
              </Button>

              <p className="text-sm">
                Already have an account?{" "}
                <Button
                  className="underline cursor-pointer"
                  onClick={handleFormSwap}
                  variant="link"
                  disabled={isLoading ? true : false}
                >
                  Sign in
                </Button>
              </p>
            </CardFooter>
          </Card>
        )}
      </div>
    </>
  );
};
export default Login;

//todo: have to click signup twice to get it to work for some reason?
