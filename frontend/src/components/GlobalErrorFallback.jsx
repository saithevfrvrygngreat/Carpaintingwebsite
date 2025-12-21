import { useRouteError } from "react-router-dom";

export default function GlobalErrorFallback({ error, resetErrorBoundary }) {
    return (
        <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 max-w-lg mx-auto mt-20">
            <h2 className="text-lg font-bold mb-2">Something went wrong:</h2>
            <pre className="text-sm overflow-auto whitespace-pre-wrap font-mono mb-4">{error.message}</pre>
            <pre className="text-xs overflow-auto whitespace-pre-wrap font-mono text-gray-600 mb-4">{error.stack}</pre>
            <button onClick={resetErrorBoundary} className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900">Try again</button>
        </div>
    );
}
