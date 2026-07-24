import { Button } from "react-bootstrap";

function ExportButton() {

    const downloadCSV = () => {

        window.open(
            "http://localhost:5000/api/logs/export",
            "_blank"
        );

    };

    return (

        <div className="mb-4">

            <Button
                variant="success"
                onClick={downloadCSV}
            >
                📥 Export Audit Logs
            </Button>

        </div>

    );

}

export default ExportButton;