import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product, ProductParameters } from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";

interface CatalogState {
    productsLoaded: boolean;
    filtersLoaded: boolean;
    status: string;
    brands: string[];
    types: string[];
    productParameters : ProductParameters;
}

const productsAdapter = createEntityAdapter<Product>();

export const fetchProductsAsync = createAsyncThunk<Product[]>(
    'catalog/fetchProductsAsync',
    async (_, thunkAPI) => {
        try {
            return await agent.Catalog.list();
        }
        catch(error : any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

export const fetchProductAsync = createAsyncThunk<Product, number>(
    'catalog/fetcProductAsync',
    async (productId, thunkAPI) => {
        try{
            return await agent.Catalog.details(productId);
        }
        catch (error : any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

export const fetchFiltersAsync = createAsyncThunk(
    'catalog/getchFiltersAsync',
    async (_, thunkAPI) => {
        try {
            return agent.Catalog.fetchFilters();
        } catch (error : any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

function initialiseParameters() {
    return {
        pageNumber: 1,
        pageSize: 6,
        orderBy: 'name'
    }
}

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productsAdapter.getInitialState<CatalogState>({
        productsLoaded: false,
        filtersLoaded : false,
        status: 'idle',
        brands: [],
        types: [],
        productParameters: initialiseParameters()
    }),
    reducers: {
        setProductParameters: (state, action) => {
            state.productsLoaded = false;
            state.productParameters = {...state.productParameters, ...action.payload};
        },
        resetProductParameters: (state) => {
            state.productParameters = initialiseParameters();
        }
    },
    extraReducers: (builder => {
        builder.addCase(fetchProductsAsync.pending, (state) => {
            state.status = 'pendingFetchProducts';
        });

        builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
            productsAdapter.setAll(state, action.payload);
            state.status = 'idle';
            state.productsLoaded = true
        });

        builder.addCase(fetchProductsAsync.rejected, (state, action) => {
            console.log(action.payload);
            state.status = 'idle';
        });

        builder.addCase(fetchProductAsync.pending, (state) => {
            state.status = 'pendingFetchProduct';
        });

        builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
            productsAdapter.upsertOne(state, action.payload);
            state.status='idle';
        });

        builder.addCase(fetchProductAsync.rejected, (state, action) => {
            console.log(action);
            state.status = 'idle';
        });

        builder.addCase(fetchFiltersAsync.pending, (state) => {
            state.status = 'pendingFetchFilters';
        });

        builder.addCase(fetchFiltersAsync.fulfilled, (state, action) => {
            state.brands = action.payload.brands;
            state.types = action.payload.types;
            state.filtersLoaded = true;
            state.status = 'idle';
        });

        builder.addCase(fetchFiltersAsync.rejected, (state) => {
            state.status = 'idle';

        });
    })
})

export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);
export const {setProductParameters, resetProductParameters} = catalogSlice.actions;