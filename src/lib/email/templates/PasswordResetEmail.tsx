import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface PasswordResetEmailProps {
  resetLink: string;
  username: string;
}

export const PasswordResetEmail = ({
  resetLink,
  username,
}: PasswordResetEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your SocialSphere password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Password Reset Request</Heading>
          <Text style={text}>Hi {username},</Text>
          <Text style={text}>
            We received a request to reset your password for your SocialSphere
            account. Click the button below to set a new password.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={resetLink}>
              Reset Password
            </Button>
          </Section>
          <Text style={text}>
            If you did not request a password reset, you can safely ignore this
            email. Your password will remain unchanged.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f4f4f5",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  maxWidth: "500px",
  textAlign: "center" as const,
};

const h1 = {
  color: "#18181b",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "40px",
  margin: "0 0 20px",
};

const text = {
  color: "#52525b",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 16px",
  padding: "0 24px",
};

const buttonContainer = {
  margin: "24px 0",
};

const button = {
  backgroundColor: "#4f46e5",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

export default PasswordResetEmail;
