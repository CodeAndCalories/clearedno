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
  const dashboardUrl = `${process.env.NEXT_PUBLIC_URL}/dashboard`;
  const addPermitUrl  = `${process.env.NEXT_PUBLIC_URL}/dashboard/add`;

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

          {/* Headline */}
          <Section
            style={{
              borderTop: "4px solid #FF6B00",
              padding: "40px 32px 32px",
              backgroundColor: "#0A0A0A",
            }}
          >
            <Text
              style={{
                fontFamily: "'Bebas Neue', 'Arial Black', sans-serif",
                fontSize: "42px",
                letterSpacing: "0.08em",
                color: "#F5F0E8",
                lineHeight: 1,
                margin: "0 0 8px",
              }}
            >
              YOUR PERMITS ARE NOW BEING WATCHED.
            </Text>
            <Text
              style={{
                fontSize: "13px",
                color: "rgba(245,240,232,0.6)",
                margin: "16px 0 0",
                lineHeight: "1.7",
              }}
            >
              Welcome, {userName}. Your 14-day free trial is active. Add your first permit
              and we&apos;ll start monitoring it within the hour.
            </Text>
          </Section>

          {/* Steps */}
          <Section
            style={{
              backgroundColor: "#0F0F0F",
              padding: "32px",
              borderLeft: "4px solid #FF6B00",
              margin: "0 0 0",
            }}
          >
            {[
              {
                num: "01",
                title: "Add Your Permits",
                desc: "Log in and enter your permit numbers. Takes 30 seconds each.",
              },
              {
                num: "02",
                title: "We Monitor 24/7",
                desc: "Our scrapers check every city portal every few hours.",
              },
              {
                num: "03",
                title: "Get Instant Alerts",
                desc: "Email the moment a status changes. Move your crew the same day.",
              },
            ].map(({ num, title, desc }) => (
              <Section key={num} style={{ marginBottom: "20px" }}>
                <Text
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.2em",
                    color: "#FF6B00",
                    textTransform: "uppercase",
                    margin: "0 0 2px",
                  }}
                >
                  Step {num}
                </Text>
                <Text
                  style={{
                    fontFamily: "'Bebas Neue', 'Arial Black', sans-serif",
                    fontSize: "20px",
                    letterSpacing: "0.08em",
                    color: "#F5F0E8",
                    margin: "0 0 4px",
                  }}
                >
                  {title}
                </Text>
                <Text
                  style={{
                    fontSize: "12px",
                    color: "rgba(245,240,232,0.5)",
                    margin: 0,
                    lineHeight: "1.6",
                  }}
                >
                  {desc}
                </Text>
              </Section>
            ))}
          </Section>

          {/* CTA */}
          <Section style={{ padding: "32px", backgroundColor: "#0A0A0A" }}>
            <Link
              href={addPermitUrl}
              style={{
                display: "inline-block",
                backgroundColor: "#FF6B00",
                color: "#0A0A0A",
                fontFamily: "'DM Mono', monospace",
                fontSize: "12px",
                fontWeight: "500",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                textDecoration: "none",
                padding: "14px 32px",
                marginRight: "12px",
              }}
            >
              Add Your First Permit →
            </Link>
          </Section>

          {/* Footer */}
          <Hr style={{ borderColor: "rgba(255,107,0,0.15)", margin: 0 }} />
          <Section style={{ padding: "24px 32px" }}>
            <Text
              style={{
                fontSize: "10px",
                color: "rgba(245,240,232,0.25)",
                letterSpacing: "0.1em",
                margin: 0,
              }}
            >
              ClearedNo · $79/mo after trial · No long-term contract ·{" "}
              <Link
                href={dashboardUrl}
                style={{ color: "rgba(255,107,0,0.5)" }}
              >
                Dashboard
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default WelcomeEmail;
