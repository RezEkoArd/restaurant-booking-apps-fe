
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import type { TableItem } from "@/types";
import { Link } from "react-router-dom";
import { Loading } from "@/components/loading";
import type { TableAllResponse } from "@/types/response";
import axios from "axios" 
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";


const DashboardPage = () => {
  const [tables, setTables] = useState<TableItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [summary, setSummary] = useState({
    total_table: 0,
    available: 0,
    occupied: 0,
    reserved: 0,
    maintenance: 0
  });

  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoading(true);
        setError(null);   
        const response = await axios.get<TableAllResponse>("http://127.0.0.1:8000/api/tables");
        
        // Menggunakan mock data
        if (response.data.success && response.data?.data.all_tables) {
          setTables(response.data.data.all_tables);
          setSummary(response.data.data.summary);
        } else {
          setError("Gagal mengambil data tables");
        }
      } catch (err: any) {
        console.error("Error fetching tables:", err);
        setError("Terjadi kesalahan saat mengambil data.");
      } finally {
        setLoading(false);
      }
    };
    fetchTables();
  },[]);


  const filteredTables = tables.filter((table) =>
    table.table_no.includes(searchTerm)
  );
  
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
      logout();
      navigate('/login');
    }

   if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 p-4 border border-red-200 rounded bg-red-50">
          <p><strong>Error:</strong> {error}</p>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

 return (
    <>
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
        <div className="flex gap-10">
          <h1 className="text-2xl font-semibold">RestaurantPOS</h1>
          {/* Search Bar */}
          <div className="flex items-center gap-2 max-w-md">
            <Input
              placeholder="Search table..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

          {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="font-semibold text-lg">Hello, {user?.name}</span>
            {/* <span>({user?.role_id === 1 ? 'Pelayan' : 'Kasir'})</span> */}
            <Button 
              onClick={handleLogout}
              className="cursor-pointer"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link to="/login">
            <Button className="cursor-pointer">Login</Button>
          </Link>
        )}

      </header>

      <div className="p-6 h-[90vh] flex flex-col space-y-6 bg-slate-100">
        {/* Content Header */}
        <div className="w-full flex flex-row justify-between">
          <h2 className="font-semibold text-xl">Table Management</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setViewMode("grid")}>
              Floor Plan
            </Button>
            <Button variant="outline" size="sm" onClick={() => setViewMode("list")}>
              List View
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Card>
          <CardContent>
            <div className="mb-6 flex items-center gap-4 text-sm">
              <span className="font-medium">Table Status:</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Available</span>
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Occupied</span>
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>Reserved</span>
                <div className="w-3 h-3 bg-gray-500 rounded"></div>
                <span>Maintenance</span>
              </div>
            </div>

            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-6 gap-3 mb-6">
                {filteredTables.map((table) => {
                  const bgColor =
                    table.status === "available"
                      ? "bg-green-500"
                      : table.status === "occupied"
                      ? "bg-red-500"
                      : table.status === "reserved"
                      ? "bg-yellow-500"
                      : "bg-gray-500";
                  return (
                    <button
                      key={table.id}
                      className={`px-2 py-10 rounded-lg ${bgColor} text-white font-semibold transition hover:opacity-80 cursor-pointer`}
                    >
                      {table.table_no}
                    </button>
                  );
                })}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTables.map((table) => (
                    <TableRow key={table.id}>
                      <TableCell>{table.table_no}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            table.status === "available"
                              ? "bg-green-100 text-green-800"
                              : table.status === "occupied"
                              ? "bg-red-100 text-red-800"
                              : table.status === "reserved"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="cursor-pointer">
                          Open Order
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Optional: Tampilkan statistik */}
        <div className="flex gap-6 text-sm text-gray-700">
          <span>Available: <strong>{summary.available}</strong></span>
          <span>Occupied: <strong>{summary.occupied}</strong></span>
          <span>Reserved: <strong>{summary.reserved}</strong></span>
          <span>Maintenance: <strong>{summary.maintenance}</strong></span>
          <span>Total Table: <strong>{summary.total_table}</strong></span>
        </div>
      </div>
    </>
  );
}

export default DashboardPage