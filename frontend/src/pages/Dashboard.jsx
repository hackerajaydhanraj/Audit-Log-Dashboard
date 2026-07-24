import { useState } from "react";
import Navbar from "../components/Navbar";
import SummaryCards from "../components/SummaryCards";
import UploadCSV from "../components/UploadCSV";
import ExportButton from "../components/ExportButton";
import AuditTable from "../components/AuditTable";
import Charts from "../components/Charts";
import "../styles/dashboard.css";

function Dashboard() {

    const [refreshKey, setRefreshKey] = useState(0);

    const refreshDashboard = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <>
            <Navbar />

            <div className="container dashboard">

                <h2 className="title mb-4">
                    Audit Log Dashboard
                </h2>

                <SummaryCards key={"summary-" + refreshKey} />

                <UploadCSV onUploadSuccess={refreshDashboard} />

                <ExportButton />

                <AuditTable key={"table-" + refreshKey} />

                <Charts key={"charts-" + refreshKey} />

            </div>
        </>
    );
}

export default Dashboard;