import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import {
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    Paperclip,
    ArrowRight,
    Loader2
} from "lucide-react";

function MySubmissions() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:3000/api/submissions/my", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSubmissions(res.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-indigo-500" size={28} />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">My Submissions</h1>
            <p className="text-gray-500 text-sm mb-7">View all your submitted assignments and staff remarks</p>

            {submissions.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-8 text-center shadow-sm">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                        <FileText size={20} />
                    </div>
                    <h3 className="text-gray-900 font-semibold mb-1">No submissions yet</h3>
                    <p className="text-sm text-gray-500 mb-4">You haven&apos;t submitted any assignments.</p>
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                        Go to Assignments <ArrowRight size={16} />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {submissions.map((sub) => (
                        <SubmissionCard
                            key={sub._id}
                            submission={sub}
                            onClick={() => navigate(`/submission/${sub._id}`)}
                        />
                    ))}
                </div>
            )}
        </Layout>
    );
}

function SubmissionCard({ submission, onClick }) {
    const assignment = typeof submission.assignment === "object" ? submission.assignment : {};

    const statusStyles = {
        PENDING: "bg-amber-50 text-amber-600 border border-amber-200",
        APPROVED: "bg-green-50 text-green-600 border border-green-200",
        REJECTED: "bg-red-50 text-red-500 border border-red-200",
    };

    const statusIcons = {
        PENDING: <Clock size={12} className="mr-1" />,
        APPROVED: <CheckCircle size={12} className="mr-1" />,
        REJECTED: <XCircle size={12} className="mr-1" />,
    };

    const fileName = submission.file.split(/[\\/]/).pop();
    const submittedStr = new Date(submission.createdAt).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit"
    });

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{assignment.title || "Assignment"}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Submitted: {submittedStr}</p>
                </div>
                <span className={`flex items-center flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[submission.status]}`}>
                    {statusIcons[submission.status]}
                    {submission.status}
                </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-indigo-500 truncate mt-1">
                <Paperclip size={13} className="flex-shrink-0" />
                <span className="truncate">{fileName}</span>
            </div>

            <button
                onClick={onClick}
                className="mt-2 flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
                View Details <ArrowRight size={14} />
            </button>
        </div>
    );
}

export default MySubmissions;
