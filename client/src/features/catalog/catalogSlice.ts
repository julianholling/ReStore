import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product, ProductParameters } from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";
import { MetaData } from "../../app/models/pagination";

interface CatalogState {
    productsLoaded: boolean;
    filtersLoaded: boolean;
    status: string;
    brands: string[];
    types: string[];
    productParameters : ProductParameters;
    metaData: MetaData | null;
}

const productsAdapter = createEntityAdapter<Product>();

function getAxiosParameters(productParameters: ProductParameters) {
    const parameters = new URLSearchParams();
    parameters.append('pageNumber', productParameters.pageNumber.toString());
    parameters.append('pageSize', productParameters.pageSize.toString());
    parameters.append('orderBy', productParameters.orderBy);
    if(productParameters.searchTerm){
        parameters.append('searchTerm', productParameters.searchTerm);
    }
    if(productParameters.brands.length > 0){
        parameters.append('brands', productParameters.brands.toString());
    }
    if(productParameters.types.length > 0){
        parameters.append('types', productParameters.types.toString());
    }
    return parameters;

}

export const fetchProductsAsync = createAsyncThunk<Product[], void, {state: RootState}>(
    'catalog/fetchProductsAsync',
    async (_, thunkAPI) => {
        const parameters = getAxiosParameters(thunkAPI.getState().catalog.productParameters);
        try {
            const response =  await agent.Catalog.list(parameters);
            thunkAPI.dispatch(setMetaData(response.metaData));
            return response.items;
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
        orderBy: 'name',
        brands: [],
        types: []
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
        productParameters: initialiseParameters(),
        metaData: null
    }),
    reducers: {

        setProductParameters: (state, action) => {
            state.productsLoaded = false;
            state.productParameters = { ...state.productParameters, ...action.payload, pageNumber: 1 };
        },
        setPageNumber: (state, action) => {
            state.productsLoaded = false;
            state.productParameters = { ...state.productParameters, ...action.payload};
        },
        setMetaData: (state, action) => {
            state.metaData = action.payload;
        },
        resetProductParameters: (state) => {
            state.productParameters = initialiseParameters();
        },
        setProduct: (state, action) => {
            productsAdapter.upsertOne(state, action.payload);
            state.productsLoaded = false;
        },
        removeProduct: (state, action) => {
            productsAdapter.removeOne(state, action.payload);
            state.productsLoaded = false;
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
export const { setProductParameters, resetProductParameters, setMetaData, setPageNumber, setProduct, removeProduct } = catalogSlice.actions;