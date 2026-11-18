import { getCustomers } from "@/db/queries";
export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const rows = await getCustomers().catch(() => []);
  return (
    <div className="space-y-5">
      <div><h1 className="text-xl font-bold text-dark-900">Customers</h1><p className="text-sm text-dark-400 mt-0.5">Everyone who has placed an order ({rows.length})</p></div>
      <div className="bg-white border border-dark-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-[10px] uppercase tracking-wider text-dark-400 border-b border-dark-100">
            <th className="p-3">Name</th><th className="p-3">Phone</th><th className="p-3">Email</th><th className="p-3">Orders</th><th className="p-3">Total spent</th><th className="p-3">Last order</th><th className="p-3"></th>
          </tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-dark-400">No customers yet.</td></tr>}
            {rows.map(r => (
              <tr key={r.phone} className="border-b border-dark-50 hover:bg-dark-50">
                <td className="p-3 font-semibold text-dark-800">{r.name}</td>
                <td className="p-3">{r.phone}</td>
                <td className="p-3 text-dark-500">{r.email ?? "—"}</td>
                <td className="p-3">{r.orders}</td>
                <td className="p-3 font-semibold">Rs. {Number(r.spent).toLocaleString("en-PK")}</td>
                <td className="p-3 text-dark-400">{new Date(r.last).toLocaleDateString("en-GB")}</td>
                <td className="p-3"><a className="text-green-600 text-xs font-bold" target="_blank" rel="noopener noreferrer" href={`https://wa.me/92${r.phone.replace(/^0/, "").replace(/\D/g, "")}`}>WhatsApp</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
