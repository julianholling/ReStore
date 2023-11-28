import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import ProductList from "./ProductList";
import { fetchProductsAsync, productSelectors } from "./catalogSlice";
import { useEffect } from "react";

export default function Catalog() {

    const products = useAppSelector(productSelectors.selectAll);
    const {productsLoaded, status} = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();
    

    useEffect(() => {
        if(!productsLoaded) 
        {
            dispatch(fetchProductsAsync());
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [productsLoaded]) // <--------- this will be fixed in a later chapter !!!
    
    if(status.includes('pending')) return <LoadingComponent message='Loading Products'/>

    return (
        <>
            <ProductList products={products} />
        </>
    )
}