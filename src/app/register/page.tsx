import RegisterClient from "./RegisterClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register - SocialSphere",
  description: "Create an account on SocialSphere",
};

export default function RegisterPage() {
  return <RegisterClient />;
}
