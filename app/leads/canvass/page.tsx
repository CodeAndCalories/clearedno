import { supabaseAdmin } from "@/lib/supabase/admin";

interface Props {
  searchParams: Promise<{ q?: string; county?: string; state?: string }>;
}

export default async function CanvassPage({ searchParams }: Props) {
  const { q, county, state } = await searchParams;

  let query = supabaseAdmin
    .from("roofing_leads")
    .select("id, address, county, state, owner_name, year_built")
    .not("owner_name", "is", null)
    .order("county", { ascending: true })
    .order("address", { ascending: true })
    .limit(200);

  if (q) {
    query = query.ilike("address", `%${q}%`);
  }
  if (county) {
    query = query.ilike("county", county);
  }
  if (state) {
    query = query.eq("state", state.toUpperCase());
  }

  const { data: leads } = await query;
  const rows = leads ?? [];

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; color: black; font-family: monospace; }
          table { width: 100%; border-collapse: collapse; font-size: 10px; }
          th, td { border: 1px solid #ccc; padding: 4px 6px; text-align: left; }
          th { background: #f0f0f0; font-weight: bold; }
          .page-break { page-break-after: always; }
          h1, .subtitle { color: black; }
        }
        @media screen {
          body { background: #0A0A0A; color: #F5F0E8; font-family: monospace; }
        }
      `}</style>

      <div className="min-h-screen bg-white text-black font-mono p-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-widest uppercase mb-1">
              Canvassing Sheet
            </h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest">
              ClearedNo — Property Leads &nbsp;·&nbsp; {rows.length} addresses
              {q && ` · search: "${q}"`}
              {county && ` · county: ${county}`}
              {state && ` · state: ${state}`}
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="no-print bg-black text-white text-xs font-mono font-bold tracking-widest uppercase px-4 py-2 hover:bg-gray-800 transition-colors"
          >
            Print / Save PDF
          </button>
        </div>

        {rows.length === 0 ? (
          <p className="text-gray-400 text-sm">No leads found for the current filters.</p>
        ) : (
          <>
            {/* Chunk into pages of 40 */}
            {Array.from({ length: Math.ceil(rows.length / 40) }, (_, pageIdx) => {
              const pageRows = rows.slice(pageIdx * 40, pageIdx * 40 + 40);
              return (
                <div key={pageIdx} className={pageIdx < Math.ceil(rows.length / 40) - 1 ? "page-break" : ""}>
                  {pageIdx > 0 && (
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 mt-8 no-print">
                      Page {pageIdx + 1}
                    </p>
                  )}
                  <table className="w-full border-collapse text-xs mb-8">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-2 py-1.5 text-left w-8">#</th>
                        <th className="border border-gray-300 px-2 py-1.5 text-left">Address</th>
                        <th className="border border-gray-300 px-2 py-1.5 text-left">County</th>
                        <th className="border border-gray-300 px-2 py-1.5 text-left">Owner Name</th>
                        <th className="border border-gray-300 px-2 py-1.5 text-left w-16">Yr Built</th>
                        <th className="border border-gray-300 px-2 py-1.5 text-left w-32">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageRows.map((lead, i) => (
                        <tr key={lead.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="border border-gray-300 px-2 py-1.5 text-gray-400">
                            {pageIdx * 40 + i + 1}
                          </td>
                          <td className="border border-gray-300 px-2 py-1.5">
                            {lead.address ?? "—"}
                          </td>
                          <td className="border border-gray-300 px-2 py-1.5 capitalize">
                            {lead.county ?? "—"}
                          </td>
                          <td className="border border-gray-300 px-2 py-1.5">
                            {lead.owner_name ?? "—"}
                          </td>
                          <td className="border border-gray-300 px-2 py-1.5 text-center">
                            {lead.year_built ?? "—"}
                          </td>
                          <td className="border border-gray-300 px-2 py-1.5">&nbsp;</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </>
        )}

        <p className="text-[10px] text-gray-300 uppercase tracking-widest mt-4 no-print">
          Generated {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · clearedno.com
        </p>
      </div>
    </>
  );
}
