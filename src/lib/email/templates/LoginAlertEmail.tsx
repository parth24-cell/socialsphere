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

interface LoginAlertEmailProps {
  username: string;
  time: string;
  deviceInfo: string;
  ipAddress: string;
}

export const LoginAlertEmail = ({
  username,
  time,
  deviceInfo,
  ipAddress,
}: LoginAlertEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>New login to your SocialSphere account</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Login Alert</Heading>
          <Text style={text}>Hi {username},</Text>
          <Text style={text}>
            We noticed a new login to your SocialSphere account. If this was
            you, you can safely ignore this email.
          </Text>
          <Container style={detailsContainer}>
            <Text style={detailText}>
              <strong>Time:</strong> {time}
            </Text>
            <Text style={detailText}>
              <strong>Device/Browser:</strong> {deviceInfo}
            </Text>
            <Text style={detailText}>
              <strong>IP Address:</strong> {ipAddress}
            </Text>
          </Container>
          <Text style={text}>
            If you did not authorize this login, please reset your password
            immediately.
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

const detailsContainer = {
  background: "#f4f4f5",
  borderRadius: "4px",
  margin: "16px 24px",
  padding: "16px",
  textAlign: "left" as const,
};

const detailText = {
  color: "#3f3f46",
  fontSize: "14px",
  margin: "4px 0",
};

export default LoginAlertEmail;
