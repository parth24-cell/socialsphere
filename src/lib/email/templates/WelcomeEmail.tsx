import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  username: string;
}

export const WelcomeEmail = ({ username }: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to SocialSphere, {username}! 🎉</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to SocialSphere! 🎉</Heading>
          <Text style={text}>Hi {username},</Text>
          <Text style={text}>
            Your email has been successfully verified and your account is now
            active. We are thrilled to have you on board!
          </Text>
          <Text style={text}>
            Start connecting with friends, sharing stories, and exploring the
            SocialSphere community today.
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

export default WelcomeEmail;
