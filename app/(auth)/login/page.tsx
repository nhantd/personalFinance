import { Suspense } from "react";
import LoginPage from "./login-page";

export default function LoginPageWrapper() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}
