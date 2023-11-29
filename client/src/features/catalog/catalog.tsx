import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import ProductList from "./ProductList";
import { fetchFiltersAsync, fetchProductsAsync, productSelectors } from "./catalogSlice";
import { useEffect } from "react";

export default function Catalog() {

    const products = useAppSelector(productSelectors.selectAll);
    const {productsLoaded, status, filtersLoaded} = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();
    
    //  Use two useEffects here to stop a double request call to redux store.
    useEffect(() => {
        
        if(!productsLoaded) 
        {
            dispatch(fetchProductsAsync());
        }
        
    }, [productsLoaded, dispatch])
    
    useEffect(() => {
        
        if(!filtersLoaded)
        {
            dispatch(fetchFiltersAsync());
        }

    }, [dispatch, filtersLoaded])

    if(status.includes('pending')) {
        return <LoadingComponent message='Loading Products'/>
    }

    return (
        <>
            <ProductList products={products} />
        </>
    )
}