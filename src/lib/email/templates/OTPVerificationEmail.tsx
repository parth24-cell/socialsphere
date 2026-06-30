import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface OTPVerificationEmailProps {
  otp: string;
  username: string;
}

export const OTPVerificationEmail = ({
  otp,
  username,
}: OTPVerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your SocialSphere Verification Code: {otp}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to SocialSphere!</Heading>
          <Text style={text}>Hi {username},</Text>
          <Text style={text}>
            Thank you for registering. Please use the following 6-digit code to
            verify your email address and activate your account.
          </Text>
          <Section style={codeContainer}>
            <Text style={code}>{otp}</Text>
          </Section>
          <Text style={text}>
            This code will expire in 10 minutes. If you did not request this
            code, please ignore this email.
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

const codeContainer = {
  background: "#f4f4f5",
  borderRadius: "4px",
  margin: "16px 24px",
  padding: "16px",
};

const code = {
  color: "#4f46e5",
  fontSize: "32px",
  fontWeight: "700",
  letterSpacing: "8px",
  lineHeight: "40px",
  margin: "0",
};

export default OTPVerificationEmail;
