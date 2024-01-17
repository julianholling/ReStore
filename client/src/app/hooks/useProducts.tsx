import { useEffect } from "react";
import { fetchFiltersAsync, fetchProductsAsync, productSelectors } from "../../features/catalog/catalogSlice";
import { useAppSelector, useAppDispatch } from "../store/configureStore";

export default function useProducts() {

    const products = useAppSelector(productSelectors.selectAll);
    const { productsLoaded, filtersLoaded, brands, types, metaData } = useAppSelector(state => state.catalog);
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

    return {
        products,
        productsLoaded,
        filtersLoaded,
        brands,
        types,
        metaData
    }
}