import { useEffect, useState } from "react";
import { Row, Col, Card, Spinner } from "react-bootstrap";
import {
    Chart as ChartJS,
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";
import api from "../api/api";

ChartJS.register(
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
);

function Charts() {

    const [stats, setStats] = useState(null);

    useEffect(() => {

        loadStats();

    }, []);

    const loadStats = async () => {

        try {

            const res = await api.get("/logs/stats");

            setStats(res.data.data);

        } catch (err) {

            console.log(err);

        }

    };

    if (!stats)

        return (
            <div className="text-center">
                <Spinner animation="border"/>
            </div>
        );

    const pieData = {

        labels: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],

        datasets: [

            {

                data: [

                    stats.severity.low,

                    stats.severity.medium,

                    stats.severity.high,

                    stats.severity.critical

                ],

                backgroundColor: [

                    "#28a745",

                    "#17a2b8",

                    "#ffc107",

                    "#dc3545"

                ]

            }

        ]

    };

    const barData = {

        labels: ["Resolved", "Unresolved"],

        datasets: [

            {

                label: "Audit Logs",

                data: [

                    stats.resolved,

                    stats.unresolved

                ],

                backgroundColor: [

                    "#198754",

                    "#dc3545"

                ]

            }

        ]

    };

    return (

        <Row className="mt-5">

            <Col md={6}>

                <Card className="dashboard-card">

                    <Card.Body>

                        <h5 className="text-center mb-3">

                            Severity Distribution

                        </h5>

                        <Pie data={pieData}/>

                    </Card.Body>

                </Card>

            </Col>

            <Col md={6}>

                <Card className="dashboard-card">

                    <Card.Body>

                        <h5 className="text-center mb-3">

                            Resolution Status

                        </h5>

                        <Bar data={barData}/>

                    </Card.Body>

                </Card>

            </Col>

        </Row>

    );

}

export default Charts;