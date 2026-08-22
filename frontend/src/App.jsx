import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api";

function App() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [leads, setLeads] = useState([]);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);


    // GET ALL LEADS
   const fetchLeads = async () => {
    try {
        setFetchLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/lead`);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch leads");
        }

        setLeads(Array.isArray(data) ? data : []);

    } catch (error) {
        console.error("Fetch leads error:", error);

        setError(error.message || "Failed to fetch leads");

        setLeads([]);

    } finally {
        setFetchLoading(false);
    }
};


    // CREATE LEAD
    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!name.trim() || !email.trim()) {
            setError("Name and email are required");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/lead`, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                return;
            }

            setMessage(data.message);

            setName("");
            setEmail("");

            // Refresh leads
            fetchLeads();

        } catch (error) {
            console.error(error);

            setError("Something went wrong");

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchLeads();
    }, []);


    return (
        <div className="container">

            <div className="card">

                <h1>Lead Management System</h1>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>Name</label>

                        <input
                            type="text"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                    </div>


                    <div className="form-group">

                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Adding..." : "Add Lead"}
                    </button>

                </form>


                {message && (
                    <div className="success">
                        {message}
                    </div>
                )}


                {error && (
                    <div className="error">
                        {error}
                    </div>
                )}

            </div>


            <div className="card">

                <h2>All Leads</h2>

                {fetchLoading ? (
                    <p>Loading leads...</p>
                ) : leads.length === 0 ? (
                    <p>No leads found.</p>
                ) : (

                    <table>

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Created At</th>
                            </tr>

                        </thead>


                        <tbody>

                            {leads.map((lead) => (

                                <tr key={lead.id}>

                                    <td>{lead.id}</td>

                                    <td>{lead.name}</td>

                                    <td>{lead.email}</td>

                                    <td>
                                        {new Date(
                                            lead.created_at
                                        ).toLocaleString()}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                )}

            </div>

        </div>
    );
}

export default App;