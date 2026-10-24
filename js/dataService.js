const loadsJson = async(path) =>{
    const response = await fetch(path);
    if(!response.ok){
        throw new Error(`Cannot load ${path} (status ${response.status})`);

    } return await response.json();
};

export const loadAllData=async()=>{
    const [customers, products, orders]=await Promise.all([
        loadsJson("data/customers.json"),
        loadsJson("data/products.json"),
        loadsJson("data/orders.json"),
    ]);
    return{customers, products, orders};
};