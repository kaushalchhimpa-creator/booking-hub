import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const API_URL = "https://booking-hub-backend-plga.onrender.com/api/bookings/admin/overview";
const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const Admin = () => {
  const { token, user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [staff, setStaff] = useState([]);
  const [staffQuery, setStaffQuery] = useState("");
  const [clientQuery, setClientQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [activeTab, setActiveTab] = useState("clients");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data.data.bookings || []);
        setStaff(response.data.data.staff || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Could not load admin data.");
      } finally {
        setLoading(false);
      }
    };
    loadOverview();
  }, [token]);

  const selectedStaff = useMemo(
    () => staff.find((member) => member.name.toLowerCase() === staffQuery.trim().toLowerCase()),
    [staff, staffQuery],
  );

  const staffBookings = useMemo(() => {
    if (!staffQuery.trim()) return bookings;
    const query = staffQuery.trim().toLowerCase();
    return bookings.filter((booking) => booking.provider?.name?.toLowerCase().includes(query));
  }, [bookings, staffQuery]);

  const filteredBookings = useMemo(() => staffBookings.filter((booking) => {
    const matchesClient = booking.user?.name?.toLowerCase().includes(clientQuery.trim().toLowerCase());
    return matchesClient && (status === "All" || booking.status === status);
  }), [staffBookings, clientQuery, status]);

  const summary = useMemo(() => staffBookings.reduce((totals, booking) => {
    const amount = Number(booking.visitingCharge || 0);
    totals.total += amount;
    if (booking.status === "Completed") totals.received += amount;
    else totals.pending += amount;
    return totals;
  }, { total: 0, received: 0, pending: 0 }), [staffBookings]);

  if (user?.role !== "Admin") return <Navigate to="/" replace />;

  const visibleClients = filteredBookings.filter((booking) => booking.user);

  return (
    <main className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-5">
        <section className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h1 className="text-lg font-black text-gray-800">Admin Management</h1>
              <p className="text-xs text-gray-400 mt-1">Staff-wise clients and payment overview</p>
            </div>
            <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold">
              {[["clients", "Clients"], ["payments", "Payments"]].map(([key, label]) => (
                <button key={key} onClick={() => setActiveTab(key)} className={`px-4 py-2 rounded-lg transition-colors ${activeTab === key ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wide text-gray-400 mb-1">Staff Name</label>
              <input list="staff-list" value={staffQuery} onChange={(e) => setStaffQuery(e.target.value)} placeholder="Select or type staff name" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-blue-500" />
              <datalist id="staff-list">{staff.map((member) => <option key={member._id} value={member.name} />)}</datalist>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wide text-gray-400 mb-1">Client Name</label>
              <input value={clientQuery} onChange={(e) => setClientQuery(e.target.value)} placeholder="Search client" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-blue-500" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wide text-gray-400 mb-1">Booking Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold bg-white focus:outline-blue-500">
                <option value="All">All statuses</option>
                {['Pending', 'Accepted', 'Satisfied', 'Completed'].map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
          </div>
        </section>

        {staffQuery && (
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              ["Total Payment", summary.total, "text-blue-600 bg-blue-50 border-blue-100"],
              ["Received", summary.received, "text-green-600 bg-green-50 border-green-100"],
              ["Pending", summary.pending, "text-amber-700 bg-amber-50 border-amber-100"],
            ].map(([label, amount, style]) => <div key={label} className={`rounded-2xl border p-4 ${style}`}>
              <p className="text-[10px] uppercase tracking-wide font-black opacity-70">{label}</p>
              <p className="text-xl font-black mt-1">{money(amount)}</p>
              <p className="text-[10px] mt-1 opacity-70">{selectedStaff ? selectedStaff.name : staffQuery}</p>
            </div>)}
          </section>
        )}

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-100">
            <h2 className="text-sm font-black text-gray-800">{activeTab === "clients" ? "Clients" : "Payments"}</h2>
            <p className="text-[11px] text-gray-400 mt-1">{staffQuery ? `Showing records assigned to ${staffQuery}` : "Select a staff member to view their complete overview."}</p>
          </div>
          {loading ? <div className="p-10 text-center text-xs font-bold text-gray-400">Loading admin data...</div> : error ? <div className="p-10 text-center text-xs font-bold text-red-500">{error}</div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead><tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                  <th className="p-3">Client</th><th className="p-3">Staff Name</th><th className="p-3">Service</th><th className="p-3">Status</th>
                  {activeTab === "payments" && <><th className="p-3 text-right">Amount</th><th className="p-3">Payment State</th></>}
                </tr></thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {visibleClients.map((booking) => <tr key={booking._id} className="hover:bg-gray-50/50">
                    <td className="p-3"><span className="block font-bold text-gray-800">{booking.user.name}</span><span className="text-[10px] text-gray-400">{booking.user.contactNumber || booking.user.email}</span></td>
                    <td className="p-3 font-semibold text-blue-600">{booking.provider?.name || "Unassigned"}</td><td className="p-3">{booking.category}</td>
                    <td className="p-3"><span className="px-2 py-1 rounded-md bg-gray-100 font-bold text-[10px]">{booking.status}</span></td>
                    {activeTab === "payments" && <><td className="p-3 text-right font-black">{money(booking.visitingCharge)}</td><td className="p-3"><span className={`px-2 py-1 rounded-md font-bold text-[10px] ${booking.status === "Completed" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-700"}`}>{booking.status === "Completed" ? "Received" : "Pending"}</span></td></>}
                  </tr>)}
                  {!visibleClients.length && <tr><td colSpan={activeTab === "payments" ? 6 : 4} className="p-10 text-center text-xs text-gray-400">No matching client records found.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Admin;
