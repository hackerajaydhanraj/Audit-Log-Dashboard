import { useEffect, useState } from "react";
import { Card, Col, Row, Spinner } from "react-bootstrap";
import { FaDatabase, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";
import api from "../api/api";

function SummaryCards() {

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {

            const res = await api.get("/logs/stats");
            setStats(res.data.data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }
    };

    if (loading) {
        return (
            <div className="text-center mb-4">
                <Spinner animation="border" />
            </div>
        );
    }

    const cards = [
        {
            title: "Total Logs",
            value: stats.totalLogs,
            icon: <FaDatabase size={35} />,
            color: "primary"
        },
        {
            title: "Resolved",
            value: stats.resolved,
            icon: <FaCheckCircle size={35} />,
            color: "success"
        },
        {
            title: "Unresolved",
            value: stats.unresolved,
            icon: <FaTimesCircle size={35} />,
            color: "warning"
        },
        {
            title: "Critical",
            value: stats.severity.critical,
            icon: <FaExclamationTriangle size={35} />,
            color: "danger"
        }
    ];

    return (

        <Row className="mb-4">

            {cards.map((card, index) => (

                <Col lg={3} md={6} className="mb-3" key={index}>

                    <Card className={`dashboard-card border-${card.color}`}>

                        <Card.Body>

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <h6 className="text-muted">{card.title}</h6>

                                    <h2>{card.value}</h2>

                                </div>

                                <div className={`text-${card.color}`}>

                                    {card.icon}

                                </div>

                            </div>

                        </Card.Body>

                    </Card>

                </Col>

            ))}

        </Row>

    );

}

export default SummaryCards;