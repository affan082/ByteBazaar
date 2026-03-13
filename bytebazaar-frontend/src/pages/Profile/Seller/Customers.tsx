import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Spinner, Alert } from "react-bootstrap";
import config from "../../../config/global-info.json";

interface Customer {
    _id: string;
    fullname: string;
    email: string;
    phone?: string;
}

function Customers() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        axios
            .get(config.server.uri + "seller/customers", { withCredentials: true })
            .then((res) => {
                setCustomers(res.data.data || []);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to fetch customers");
                setLoading(false);
            });
    }, []);

    return (
        <Container className="customers-page py-4">
            <h3 className="mb-4">My Customers</h3>

            {loading && <Spinner animation="border" />}
            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && customers.length === 0 && (
                <p>You don’t have any customers yet.</p>
            )}

            {!loading && customers.length > 0 && (
                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                    </tr>
                    </thead>
                    <tbody>
                    {customers.map((customer, idx) => (
                        <tr key={customer._id}>
                            <td>{idx + 1}</td>
                            <td>{customer.fullname}</td>
                            <td>{customer.email}</td>
                            <td>{customer.phone || "—"}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
}

export default Customers;
