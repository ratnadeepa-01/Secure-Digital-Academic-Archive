function SubmissionCard({ submission, onApprove, onReject }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6 flex justify-between items-center">
      <div>
        <h3 className="font-semibold">{submission.student.name}</h3>
        <p className="text-gray-500">{submission.assignment.title}</p>

        <a
          href={`http://localhost:3000/${submission.file.replace(/\\/g, "/")}`}
          target="_blank"
          rel="noreferrer"
          className="text-indigo-600 underline"
        >
          View File
        </a>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onApprove}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          Approve
        </button>

        <button
          onClick={onReject}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Reject
        </button>
      </div>
    </div>
  );
}

export default SubmissionCard;