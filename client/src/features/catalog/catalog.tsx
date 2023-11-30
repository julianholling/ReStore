import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import ProductList from "./ProductList";
import { fetchFiltersAsync, fetchProductsAsync, productSelectors, setProductParameters} from "./catalogSlice";
import { useEffect } from "react";
import { Grid, Paper, FormControlLabel, FormGroup, Checkbox, Box, Typography, Pagination } from "@mui/material";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";

const sortOptions = [
    {value: 'name', label: 'Alphabetical'},
    {value: 'priceDesc', label: 'Price - High to low'},
    {value: 'price', label: 'Price - Low to high'}
]

export default function Catalog() {

    const products = useAppSelector(productSelectors.selectAll);
    const {productsLoaded, status, filtersLoaded, brands, types, productParameters} = useAppSelector(state => state.catalog);
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
        <Grid container spacing={4}>
            <Grid item xs={3}>
                
                <Paper sx={{mb:2}}>
                    <ProductSearch />
                </Paper>
                
                <Paper sx={{mb:2, p: 2}}>
                    <RadioButtonGroup 
                        selectedValue={productParameters.orderBy} 
                        options={sortOptions} 
                        onChange={(e) => dispatch(setProductParameters({orderBy: e.target.value}))} />
                </Paper>

                <Paper sx={{mb:2, p:2}}>
                    <FormGroup>
                        {brands.map(brand => (
                            <FormControlLabel control={<Checkbox />} label={brand} key={brand} />    
                        ))}
                        
                    </FormGroup>
                </Paper>

                <Paper sx={{mb:2, p:2}}>
                    <FormGroup>
                        {types.map(type => (
                            <FormControlLabel control={<Checkbox />} label={type} key={type} />    
                        ))}
                        
                    </FormGroup>
                </Paper>

            </Grid>

            <Grid item xs={9}>
                <ProductList products={products} />
            </Grid>
            
            <Grid item xs={3} />
            <Grid item xs={9}>
                <Box display='flex' justifyContent='space-between' alignItems='center'>
                    <Typography>
                        DIsplaying 1-6 of 18 items
                    </Typography>
                    <Pagination color='secondary' size='large' count={3} page={1} />

                </Box>
            </Grid>

        </Grid>
    )
}