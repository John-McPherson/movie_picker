export async function dataHandler(request, headers) {
    try {
        const response = await fetch(request, headers);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
    }
}


export default {
    dataHandler
}