import { Row, Col, Form, Button } from "react-bootstrap";

function SearchFilter({

    search,
    setSearch,

    severity,
    setSeverity,

    status,
    setStatus,

    region,
    setRegion,

    sort,
    setSort,

    onSearch,
    onClear

}) {

    return (

        <Row className="mb-4 g-3 align-items-end">

            <Col md={3}>

                <Form.Label>

                    Search

                </Form.Label>

                <Form.Control

                    type="text"

                    placeholder="Actor, Role, Action..."

                    value={search}

                    onChange={(e) => setSearch(e.target.value)}

                    onKeyDown={(e) => {

                        if (e.key === "Enter") {

                            onSearch();

                        }

                    }}

                />

            </Col>

            <Col md={2}>

                <Form.Label>

                    Severity

                </Form.Label>

                <Form.Select

                    value={severity}

                    onChange={(e) => setSeverity(e.target.value)}

                >

                    <option value="">All</option>
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>

                </Form.Select>

            </Col>

            <Col md={2}>

                <Form.Label>

                    Status

                </Form.Label>

                <Form.Select

                    value={status}

                    onChange={(e) => setStatus(e.target.value)}

                >

                    <option value="">All</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Unresolved">Unresolved</option>

                </Form.Select>

            </Col>

            <Col md={2}>

                <Form.Label>

                    Region

                </Form.Label>

                <Form.Select

                    value={region}

                    onChange={(e) => setRegion(e.target.value)}

                >

                    <option value="">All</option>
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Germany">Germany</option>
                    <option value="Canada">Canada</option>

                </Form.Select>

            </Col>

            <Col md={1}>

                <Form.Label>

                    Sort

                </Form.Label>

                <Form.Select

                    value={sort}

                    onChange={(e) => setSort(e.target.value)}

                >

                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>

                </Form.Select>

            </Col>

            <Col md={1}>

                <Button

                    className="w-100"

                    variant="primary"

                    onClick={onSearch}

                >

                    🔍

                </Button>

            </Col>

            <Col md={1}>

                <Button

                    className="w-100"

                    variant="secondary"

                    onClick={onClear}

                >

                    Clear

                </Button>

            </Col>

        </Row>

    );

}

export default SearchFilter;