// Weekly digest email — sent every Monday morning
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
import type { PermitStatus } from "../../types";

export interface DigestPermit {
  permit_number: string;
  address: string;
  city: string;
  state: string;
  status: PermitStatus;
  last_checked: string | null;
  previous_status?: PermitStatus | null; // set if changed this week
}

interface Props {
  userName: string;
  permits: DigestPermit[];
  changedCount: number;
  weekOf: string; // e.g. "March 24, 2025"
  unsubscribeUrl: string;
}

const STATUS_COLORS: Record<string, string> = {
  CLEARED:      "#16A34A",
  APPROVED:     "#FF6B00",
  REJECTED:     "#DC2626",
  UNDER_REVIEW: "#EAB308",
  EXPIRED:      "#6B7280",
  PENDING:      "#6B7280",
  UNKNOWN:      "#6B7280",
};

export function DigestEmail({
  userName,
  permits,
  changedCount,
  weekOf,
  unsubscribeUrl,
}: Props) {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_URL}/dashboard`;
  const greeting = userName && userName !== "there" ? `Hi ${userName},` : "Hi there,";
  const cities = permits.map((p) => p.city).filter((c, i, arr) => arr.indexOf(c) === i);
  const cityList = cities.slice(0, 3).join(", ") + (cities.length > 3 ? `, +${cities.length - 3} more` : "");

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
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
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

          {/* Title */}
          <Section
            style={{
              borderTop: "4px solid #FF6B00",
              padding: "32px 32px 24px",
              backgroundColor: "#0A0A0A",
            }}
          >
            <Text
              style={{
                fontSize: "10px",
                letterSpacing: "0.25em",
                color: "#FF6B00",
                margin: "0 0 8px",
              }}
            >
              Weekly Update · {weekOf}
            </Text>
            <Text
              style={{
                fontFamily: "'Bebas Neue', 'Arial Black', sans-serif",
                fontSize: "36px",
                letterSpacing: "0.08em",
                color: "#F5F0E8",
                lineHeight: 1,
                margin: "0 0 16px",
              }}
            >
              Your Permits This Week
            </Text>
            <Text
              style={{
                fontSize: "13px",
                color: "rgba(245,240,232,0.6)",
                margin: 0,
                lineHeight: "1.6",
              }}
            >
              {greeting}
            </Text>
          </Section>

          {/* Summary stats */}
          <Section
            style={{
              backgroundColor: "#0F0F0F",
              padding: "0",
              borderLeft: "4px solid #FF6B00",
              margin: "0 0 0",
            }}
          >
            <Row>
              <Column
                style={{
                  padding: "20px 24px",
                  borderRight: "1px solid rgba(255,107,0,0.15)",
                  textAlign: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "'Bebas Neue', 'Arial Black', sans-serif",
                    fontSize: "40px",
                    color: "#F5F0E8",
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {permits.length}
                </Text>
                <Text
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.2em",
                    color: "rgba(245,240,232,0.4)",
                    textTransform: "uppercase",
                    margin: "4px 0 0",
                  }}
                >
                  Permits Monitored
                </Text>
              </Column>
              <Column
                style={{
                  padding: "20px 24px",
                  textAlign: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "'Bebas Neue', 'Arial Black', sans-serif",
                    fontSize: "40px",
                    color: changedCount > 0 ? "#FF6B00" : "#F5F0E8",
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {changedCount}
                </Text>
                <Text
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.2em",
                    color: "rgba(245,240,232,0.4)",
                    textTransform: "uppercase",
                    margin: "4px 0 0",
                  }}
                >
                  Status Changes
                </Text>
              </Column>
            </Row>
          </Section>

          {/* No-change message or permit list */}
          {permits.length === 0 ? (
            <Section style={{ padding: "32px", backgroundColor: "#0A0A0A" }}>
              <Text
                style={{
                  fontSize: "13px",
                  color: "rgba(245,240,232,0.5)",
                  lineHeight: "1.7",
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                No active permits to report on. Add permits to your dashboard to start monitoring.
              </Text>
            </Section>
          ) : changedCount === 0 ? (
            <Section
              style={{
                padding: "24px 32px",
                backgroundColor: "#0A0A0A",
                borderLeft: "4px solid #16A34A",
                margin: "16px 0 0",
              }}
            >
              <Text
                style={{
                  fontSize: "13px",
                  color: "rgba(245,240,232,0.7)",
                  margin: 0,
                  lineHeight: "1.6",
                }}
              >
                All permits holding steady. We&apos;re watching.
              </Text>
            </Section>
          ) : null}

          {/* Per-permit breakdown */}
          {permits.length > 0 && (
            <Section style={{ padding: "24px 32px 0", backgroundColor: "#0A0A0A" }}>
              <Text
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  color: "rgba(245,240,232,0.4)",
                  textTransform: "uppercase",
                  margin: "0 0 12px",
                }}
              >
                Permit Breakdown
              </Text>
              {permits.map((permit, i) => {
                const statusColor = STATUS_COLORS[permit.status] ?? "#6B7280";
                const changed = !!permit.previous_status;
                return (
                  <Section
                    key={i}
                    style={{
                      backgroundColor: "#0F0F0F",
                      padding: "16px 20px",
                      marginBottom: "8px",
                      borderLeft: `3px solid ${changed ? "#FF6B00" : "rgba(255,107,0,0.2)"}`,
                    }}
                  >
                    <Row style={{ marginBottom: "6px" }}>
                      <Column>
                        <Text
                          style={{
                            fontSize: "12px",
                            color: "#F5F0E8",
                            fontWeight: "600",
                            margin: 0,
                            letterSpacing: "0.05em",
                          }}
                        >
                          #{permit.permit_number}
                        </Text>
                      </Column>
                      <Column style={{ textAlign: "right" }}>
                        <Text
                          style={{
                            fontSize: "10px",
                            color: statusColor,
                            fontWeight: "600",
                            margin: 0,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                          }}
                        >
                          {permit.status}
                        </Text>
                      </Column>
                    </Row>
                    <Text
                      style={{
                        fontSize: "11px",
                        color: "rgba(245,240,232,0.45)",
                        margin: "0 0 6px",
                      }}
                    >
                      {permit.address} · {permit.city}, {permit.state}
                    </Text>
                    {changed && permit.previous_status && (
                      <Text
                        style={{
                          fontSize: "11px",
                          color: "#FF6B00",
                          margin: "4px 0 0",
                          letterSpacing: "0.05em",
                        }}
                      >
                        🔄 Status changed: {permit.previous_status} → {permit.status}
                      </Text>
                    )}
                    {permit.last_checked && (
                      <Text
                        style={{
                          fontSize: "10px",
                          color: "rgba(245,240,232,0.25)",
                          margin: "4px 0 0",
                        }}
                      >
                        Last checked:{" "}
                        {new Date(permit.last_checked).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          timeZone: "America/Chicago",
                        })}{" "}
                        CT
                      </Text>
                    )}
                  </Section>
                );
              })}
            </Section>
          )}

          {/* CTA */}
          <Section style={{ padding: "28px 32px", backgroundColor: "#0A0A0A" }}>
            <Link
              href={dashboardUrl}
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
                padding: "14px 32px",
              }}
            >
              View Your Dashboard →
            </Link>
          </Section>

          {/* City note */}
          {cities.length > 0 && (
            <Section
              style={{
                padding: "0 32px 24px",
                backgroundColor: "#0A0A0A",
              }}
            >
              <Text
                style={{
                  fontSize: "11px",
                  color: "rgba(245,240,232,0.3)",
                  margin: 0,
                  letterSpacing: "0.05em",
                }}
              >
                Monitoring {cityList} permits 24/7 for you.
              </Text>
            </Section>
          )}

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
                Unsubscribe from digest
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default DigestEmail;
