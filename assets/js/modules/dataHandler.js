export async function dataHandler(request, headers) {
    try {
        let response = await fetch(request, headers);
        let data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
    }
}


export default {
    dataHandler
}