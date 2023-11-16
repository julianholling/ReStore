import { createSlice } from "@reduxjs/toolkit";

//  Redux Action Creator
export interface CounterState {
    data: number;
    title: string;
}

const initialState: CounterState = {
    data: 42,
    title: 'YARC (yet another redux counter with redux toolkit)'
}

//  Slice for the Counter functionaility to hold state for the counter
export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        //Reducer Action!!
        increment: (state, action) => {
            state.data += action.payload
        }, 
        //  Reducer Action
        decrement: (state, action) => {
            state.data -= action.payload
        }
    }
})

export const {increment, decrement} = counterSlice.actions;