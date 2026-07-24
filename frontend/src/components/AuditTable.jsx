import { useEffect, useState } from "react";
import { Table, Spinner, Alert, Pagination } from "react-bootstrap";
import api from "../api/api";
import SearchFilter from "./SearchFilter";

function AuditTable() {

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Search states
    const [searchText, setSearchText] = useState("");
    const [search, setSearch] = useState("");

    const [severity, setSeverity] = useState("");
    const [status, setStatus] = useState("");
    const [region, setRegion] = useState("");
    const [sort, setSort] = useState("newest");

    useEffect(() => {

        fetchLogs();

    }, [page, search, severity, status, region, sort]);

   const fetchLogs = async () => {

    console.log("Fetching logs...");

    try {

        setLoading(true);
        setError("");

        const res = await api.get("/logs", {
            params: {
                page,
                limit: 10,
                search,
                severity,
                status,
                region,
                sort
            }
        });

        console.log("Response:", res);

        setLogs(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);

    } catch (err) {

        console.log("FULL ERROR");
        console.log(err);
        console.log(err.code);
        console.log(err.message);
        console.log(err.response);
        console.log(err.request);

        setError("Failed to load logs.");

    } finally {

        setLoading(false);

    }
};
    const handleSearch = () => {

        setPage(1);
        setSearch(searchText);

    };

    const clearFilters = () => {

        setSearchText("");
        setSearch("");
        setSeverity("");
        setStatus("");
        setRegion("");
        setSort("newest");
        setPage(1);

    };

    if (loading)

        return (
            <div className="text-center mt-5">
                <Spinner animation="border" />
            </div>
        );

    if (error)

        return <Alert variant="danger">{error}</Alert>;

    return (

        <>

            <h4 className="mb-3">
                Audit Logs
            </h4>

            <SearchFilter

                search={searchText}
                setSearch={setSearchText}

                severity={severity}
                setSeverity={setSeverity}

                status={status}
                setStatus={setStatus}

                region={region}
                setRegion={setRegion}

                sort={sort}
                setSort={setSort}

                onSearch={handleSearch}
                onClear={clearFilters}

            />

            <Table striped bordered hover responsive>

                <thead className="table-dark">

                    <tr>

                        <th>#</th>
                        <th>Actor</th>
                        <th>Role</th>
                        <th>Action</th>
                        <th>Severity</th>
                        <th>Status</th>
                        <th>Region</th>
                        <th>Timestamp</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        logs.length === 0 ?

                            (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="text-center"
                                    >

                                        No Audit Logs Found

                                    </td>

                                </tr>

                            )

                            :

                            logs.map((log, index) => (

                                <tr key={log._id}>

                                    <td>{(page - 1) * 10 + index + 1}</td>

                                    <td>{log.actor}</td>

                                    <td>{log.role}</td>

                                    <td>{log.action}</td>

                                    <td>

                                        <span className={`badge ${
                                            log.severity === "CRITICAL"
                                                ? "bg-danger"
                                                : log.severity === "HIGH"
                                                ? "bg-warning text-dark"
                                                : log.severity === "MEDIUM"
                                                ? "bg-info text-dark"
                                                : "bg-success"
                                        }`}>

                                            {log.severity}

                                        </span>

                                    </td>

                                    <td>

                                        <span className={`badge ${
                                            log.status === "Resolved"
                                                ? "bg-success"
                                                : "bg-danger"
                                        }`}>

                                            {log.status}

                                        </span>

                                    </td>

                                    <td>{log.region}</td>

                                    <td>

                                        {new Date(log.timestamp).toLocaleDateString("en-IN")}

                                        <br />

                                        <small className="text-muted">

                                            {new Date(log.timestamp).toLocaleTimeString()}

                                        </small>

                                    </td>

                                </tr>

                            ))

                    }

                </tbody>

            </Table>

            <Pagination className="justify-content-center">

                <Pagination.Prev

                    disabled={page === 1}

                    onClick={() => setPage(page - 1)}

                />

                {

                    [...Array(totalPages)].map((_, i) => (

                        <Pagination.Item

                            key={i}

                            active={page === i + 1}

                            onClick={() => setPage(i + 1)}

                        >

                            {i + 1}

                        </Pagination.Item>

                    ))

                }

                <Pagination.Next

                    disabled={page === totalPages}

                    onClick={() => setPage(page + 1)}

                />

            </Pagination>

        </>

    );

}

export default AuditTable;