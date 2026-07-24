import { useState, useRef } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import api from "../api/api";

function UploadJSON({ onUploadSuccess }) {

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef();

    const handleFileChange = (e) => {

        const selectedFile = e.target.files[0];

        if (!selectedFile) return;

        if (!selectedFile.name.toLowerCase().endsWith(".json")) {

            toast.error("Please select a JSON file only.");

            e.target.value = "";

            return;
        }

        setFile(selectedFile);
    };

    const handleUpload = async () => {

        if (!file) {

            toast.warning("Please choose a JSON file.");

            return;
        }

        try {

            setLoading(true);

            const formData = new FormData();

            formData.append("file", file);

            const res = await api.post(
                "/logs/upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            toast.success(res.data.message);

            setFile(null);

            fileInputRef.current.value = "";

            if (onUploadSuccess) {

                onUploadSuccess();

            }

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to upload JSON file."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <Card className="shadow-sm mb-4">

            <Card.Body>

                <h4 className="mb-4">

                    📂 Upload Audit Logs (JSON)

                </h4>

                <Form.Group className="mb-3">

                    <Form.Control
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleFileChange}
                    />

                </Form.Group>

                <Button
                    onClick={handleUpload}
                    disabled={loading}
                >

                    {loading ? "Uploading..." : "📤 Upload JSON"}

                </Button>

            </Card.Body>

        </Card>

    );

}

export default UploadJSON;
