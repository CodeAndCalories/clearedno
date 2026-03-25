// Permit status change alert email
// Rendered server-side with @react-email/components and sent via Resend.
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
  Link,
  Hr,
  Font,
} from "@react-email/components";
import type { Permit } from "@/types";

interface Props {
  userName: string;
  permit: Permit;
}

const STATUS_COLORS: Record<string, string> = {
  CLEARED:  "#16A34A",
  APPROVED: "#FF6B00",
  REJECTED: "#DC2626",
  PENDING:  "#6B7280",
  UNKNOWN:  "#6B7280",
};

const STATUS_LABELS: Record<string, string> = {
  CLEARED:  "✅ PERMIT CLEARED",
  APPROVED: "🟠 PERMIT APPROVED",
  REJECTED: "❌ PERMIT REJECTED",
  PENDING:  "⏳ PERMIT PENDING",
  UNKNOWN:  "❓ STATUS UNKNOWN",
};

export function PermitClearedEmail({ userName, permit }: Props) {
  const statusColor = STATUS_COLORS[permit.status] ?? "#6B7280";
  const statusLabel = STATUS_LABELS[permit.status] ?? permit.status;
  const dashboardUrl = `${process.env.NEXT_PUBLIC_URL}/dashboard`;

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
          {/* ── Header ── */}
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

          {/* ── Status banner ── */}
          <Section
            style={{
              backgroundColor: statusColor,
              padding: "24px 32px",
            }}
          >
            <Text
              style={{
                fontFamily: "'Bebas Neue', 'Arial Black', sans-serif",
                fontSize: "36px",
                letterSpacing: "0.1em",
                color: "#0A0A0A",
                margin: 0,
              }}
            >
              {statusLabel}
            </Text>
          </Section>

          {/* ── Permit details ── */}
          <Section
            style={{
              backgroundColor: "#0F0F0F",
              padding: "32px",
              borderLeft: `4px solid ${statusColor}`,
            }}
          >
            <Text
              style={{
                fontSize: "11px",
                letterSpacing: "0.2em",
                color: "rgba(245,240,232,0.5)",
                textTransform: "uppercase",
                margin: "0 0 16px",
              }}
            >
              Permit Details
            </Text>

            {[
              { label: "Permit Number", value: permit.permit_number },
              { label: "Address",       value: permit.address },
              { label: "City / State",  value: `${permit.city}, ${permit.state}` },
              { label: "New Status",    value: permit.status, color: statusColor },
              {
                label: "Detected",
                value: new Date().toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }),
              },
            ].map(({ label, value, color }) => (
              <Row key={label} style={{ marginBottom: "12px" }}>
                <Column style={{ width: "40%" }}>
                  <Text
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.15em",
                      color: "rgba(245,240,232,0.4)",
                      textTransform: "uppercase",
                      margin: 0,
                    }}
                  >
                    {label}
                  </Text>
                </Column>
                <Column>
                  <Text
                    style={{
                      fontSize: "13px",
                      color: color ?? "#F5F0E8",
                      fontWeight: color ? "600" : "400",
                      margin: 0,
                    }}
                  >
                    {value}
                  </Text>
                </Column>
              </Row>
            ))}
          </Section>

          {/* ── CTA ── */}
          <Section style={{ padding: "32px", backgroundColor: "#0A0A0A" }}>
            <Text
              style={{
                fontSize: "13px",
                color: "rgba(245,240,232,0.6)",
                lineHeight: "1.7",
                margin: "0 0 24px",
              }}
            >
              Hi {userName}, your permit has changed status. Log in to your dashboard
              for the full history and details.
            </Text>

            <Link
              href={dashboardUrl}
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
              }}
            >
              View Permit Dashboard →
            </Link>
          </Section>

          {/* ── Footer ── */}
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
              ClearedNo · Permit monitoring for contractors ·{" "}
              <Link
                href={`${process.env.NEXT_PUBLIC_URL}/dashboard`}
                style={{ color: "rgba(255,107,0,0.5)" }}
              >
                Manage alerts
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default PermitClearedEmail;
