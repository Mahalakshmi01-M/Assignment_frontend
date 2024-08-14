export const apiFetch = async (endpoint: string, method: string = 'GET', body?: any) => {
    try {
        const response = await fetch(endpoint, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        return response.json();
    } catch (error) {
        console.error('API fetch error:', error);
        throw error;
    }
};
