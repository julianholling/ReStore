import { TextField, debounce } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setProductParameters } from "./catalogSlice";
import { useState } from "react";

export default function ProductSearch() {

    const {productParameters} = useAppSelector(state => state.catalog);
    const [searchTerm, setSearchTerm] = useState(productParameters.searchTerm);
    const dispatch = useAppDispatch();

    const debouncedSearch = debounce((event: any) => {
        if(event.target.value.toString().length >= 3 || event.target.value.toString().length === 0)
        { 
            dispatch(setProductParameters({searchTerm: event.target.value}));
        }
    }, 0);

    return (
        <TextField 
            label='Search products ...' 
            variant='outlined' 
            fullWidth 
            value = {searchTerm || ''}
            onChange={(event : any) => {
                setSearchTerm(event.target.value);
                debouncedSearch(event) 
            }} 
        />
    )
} 