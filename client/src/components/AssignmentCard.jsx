function AssignmentCard({ assignment, submission, onClick }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">{assignment.title}</h3>

        {submission && (
          <span className="px-3 py-1 rounded-full text-sm bg-yellow-200">
            {submission.status}
          </span>
        )}
      </div>

      <p className="text-gray-500 mb-4">
        Due: {new Date(assignment.dueDate).toDateString()}
      </p>

      <button
        onClick={onClick}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
      >
        {submission ? "View Submission" : "Submit Assignment"}
      </button>
    </div>
  );
}

export default AssignmentCard;