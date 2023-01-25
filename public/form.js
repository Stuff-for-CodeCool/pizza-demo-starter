const fetcher = async (url) => {
    const req = await fetch("http://localhost:9001/api/" + url);
    const res = await req.json();
    return res;
};

const main = async () => {
    const orders = await fetcher("order");
    // functie de display
};

main();
