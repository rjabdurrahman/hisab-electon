import { useSearchParams } from "react-router-dom";
import PathologyPrintReceipt from "../components/print/PathologyPrintReceipt";
import { useEffect } from "react";

const PathologyPrintPage = () => {
    const [searchParams] = useSearchParams();
    const dataStr = searchParams.get("data");

    let data = null;
    try {
        if (dataStr) {
            data = JSON.parse(decodeURIComponent(dataStr));
        }
    } catch (e) {
        console.error("Failed to parse print data", e);
    }

    if (!data) return <div className="p-10 font-bold">No print data found.</div>;

    if (!data) return <div className="p-10 font-bold">No print data found.</div>;

    return (
        <div className="bg-white min-h-screen">
             <PathologyPrintReceipt data={data} />
        </div>
    );
};

export default PathologyPrintPage;
