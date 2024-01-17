import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import ProductList from "./ProductList";
import { setProductParameters, setPageNumber } from "./catalogSlice";
import { Grid, Paper } from "@mui/material";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import CheckboxButtons from "../../app/components/CheckboxButtons";
import Pager from "../../app/components/Pager";
import useProducts from "../../app/hooks/useProducts";

const sortOptions = [
    {value: 'name', label: 'Alphabetical'},
    {value: 'priceDesc', label: 'Price - High to low'},
    {value: 'price', label: 'Price - Low to high'}
]

export default function Catalog() {

    const {products, filtersLoaded, brands, types, metaData} = useProducts();

    const { productParameters} = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();
    
    if(!filtersLoaded) {
        return <LoadingComponent message='Loading Products'/>
    }

    return (
        <Grid container columnSpacing={4}>
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
                    <CheckboxButtons 
                        items={brands}
                        checked={productParameters.brands}
                        onChange={(items: string[]) => dispatch(setProductParameters({brands: items}))}
                    />
                </Paper>

                <Paper sx={{mb:2, p:2}}>
                    <CheckboxButtons 
                        items={types}
                        checked={productParameters.types}
                        onChange={(items: string[]) => dispatch(setProductParameters({types: items}))}
                    />
                </Paper>

            </Grid>

            <Grid item xs={9}>
                <ProductList products={products} />
            </Grid>
            
            <Grid item xs={3} />
            <Grid item xs={9} sx={{mb:2}}>
                {metaData && 
                    <Pager 
                        metaData={metaData} 
                        onPageChange={(page: number) => dispatch(setPageNumber({pageNumber:page}))} /> 
                }
            </Grid>

        </Grid>
    )
}