import axios from "axios";
import { useState, useEffect } from "react";

export default function UseFetchData(url, authToken = null) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        const headers = authToken ? {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + authToken,
            },
        } : {};
        axios.get(url, headers).then((response) => {
            setData(response.data);
        })
            .catch((e) => {
                setError(e);
            }).finally(() => {
                setLoading(false);
            })
    }
    useEffect(() => {
        fetchData();
    }, [url])
    const refetch = () => {
        fetchData();
    }
    return { data, loading, error, refetch };
}