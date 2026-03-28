// Welcome / onboarding email — sent when a new user signs up
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
  Font,
} from "@react-email/components";

interface Props {
  userName: string;
}

export function WelcomeEmail({ userName }: Props) {
  const addPermitUrl = `${process.env.NEXT_PUBLIC_URL}/dashboard/add`;
  const dashboardUrl = `${process.env.NEXT_PUBLIC_URL}/dashboard`;
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_URL}/unsubscribe`;

  const greeting = userName && userName !== "there"
    ? `Hi ${userName},`
    : "Hi there,";

  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily="DM Mono"
          fallbackFontFamily="monospace"
          webFont={{
            url: "https://fonts.gstatic.com/s/dmmono/v14/aFTU7PB1QTsUX8KYvrumxA.woff2",
            format: "woff2",
          }}
        />
      </Head>
      <Body style={{ backgroundColor: "#0A0A0A", margin: 0, padding: 0 }}>
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {/* Header */}
          <Section
            style={{
              borderBottom: "1px solid rgba(255,107,0,0.3)",
              padding: "24px 32px",
            }}
          >
            <Text
              style={{
                fontFamily: "'Bebas Neue', 'Arial Black', sans-serif",
                fontSize: "28px",
                letterSpacing: "0.15em",
                color: "#FF6B00",
                margin: 0,
              }}
            >
              CLEARED<span style={{ color: "#F5F0E8" }}>NO</span>
            </Text>
          </Section>

          {/* Greeting */}
          <Section
            style={{
              borderTop: "4px solid #FF6B00",
              padding: "40px 32px 24px",
              backgroundColor: "#0A0A0A",
            }}
          >
            <Text
              style={{
                fontFamily: "'Bebas Neue', 'Arial Black', sans-serif",
                fontSize: "38px",
                letterSpacing: "0.08em",
                color: "#F5F0E8",
                lineHeight: 1,
                margin: "0 0 20px",
              }}
            >
              YOU&apos;RE IN.
            </Text>
            <Text
              style={{
                fontSize: "14px",
                color: "rgba(245,240,232,0.8)",
                margin: "0 0 8px",
                lineHeight: "1.6",
              }}
            >
              {greeting}
            </Text>
            <Text
              style={{
                fontSize: "13px",
                color: "rgba(245,240,232,0.6)",
                margin: "0",
                lineHeight: "1.7",
              }}
            >
              Welcome to ClearedNo. Add your first permit now and we&apos;ll start monitoring
              it within the hour — no setup required.
            </Text>
          </Section>

          {/* CTA Button */}
          <Section style={{ padding: "0 32px 32px", backgroundColor: "#0A0A0A" }}>
            <Link
              href={addPermitUrl}
              style={{
                display: "inline-block",
                backgroundColor: "#FF6B00",
                color: "#0A0A0A",
                fontFamily: "'DM Mono', monospace",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                textDecoration: "none",
                padding: "16px 36px",
              }}
            >
              Add Your First Permit →
            </Link>
            <Text
              style={{
                fontSize: "11px",
                color: "rgba(245,240,232,0.3)",
                margin: "10px 0 0",
                letterSpacing: "0.05em",
              }}
            >
              Takes about 30 seconds.
            </Text>
          </Section>

          {/* What to expect */}
          <Section
            style={{
              backgroundColor: "#0F0F0F",
              padding: "28px 32px 24px",
              borderLeft: "4px solid #FF6B00",
            }}
          >
            <Text
              style={{
                fontSize: "10px",
                letterSpacing: "0.25em",
                color: "#FF6B00",
                textTransform: "uppercase",
                margin: "0 0 16px",
              }}
            >
              What to Expect
            </Text>
            {[
              "We check your permits every 2 hours, 24/7",
              "You'll get an email the moment anything changes",
              "Push notifications available in your dashboard settings",
            ].map((item, i) => (
              <Text
                key={i}
                style={{
                  fontSize: "13px",
                  color: "rgba(245,240,232,0.65)",
                  margin: "0 0 10px",
                  lineHeight: "1.6",
                  paddingLeft: "16px",
                  borderLeft: "2px solid rgba(255,107,0,0.4)",
                }}
              >
                {item}
              </Text>
            ))}
          </Section>

          {/* Social proof */}
          <Section
            style={{
              padding: "28px 32px",
              backgroundColor: "#0A0A0A",
            }}
          >
            <Text
              style={{
                fontSize: "12px",
                color: "rgba(245,240,232,0.4)",
                lineHeight: "1.7",
                margin: 0,
                fontStyle: "italic",
                borderTop: "1px solid rgba(255,107,0,0.1)",
                paddingTop: "20px",
              }}
            >
              Join contractors in Austin, Dallas, Houston, and San Antonio who
              stopped checking permit portals manually.
            </Text>
          </Section>

          {/* Footer */}
          <Hr style={{ borderColor: "rgba(255,107,0,0.15)", margin: 0 }} />
          <Section style={{ padding: "20px 32px" }}>
            <Text
              style={{
                fontSize: "10px",
                color: "rgba(245,240,232,0.2)",
                letterSpacing: "0.1em",
                margin: "0 0 6px",
              }}
            >
              ClearedNo · Permit monitoring for Texas contractors
            </Text>
            <Text
              style={{
                fontSize: "10px",
                color: "rgba(245,240,232,0.2)",
                letterSpacing: "0.05em",
                margin: 0,
              }}
            >
              <Link
                href="mailto:support@clearedno.com"
                style={{ color: "rgba(255,107,0,0.45)" }}
              >
                support@clearedno.com
              </Link>
              {" · "}
              <Link
                href={dashboardUrl}
                style={{ color: "rgba(255,107,0,0.45)" }}
              >
                Dashboard
              </Link>
              {" · "}
              <Link
                href={unsubscribeUrl}
                style={{ color: "rgba(245,240,232,0.2)" }}
              >
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default WelcomeEmail;
