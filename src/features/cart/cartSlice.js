import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const url = 'https://course-api.com/react-useReducer-cart-project';

const initialState = {
    cartItems: [],
    totalAmount:0,
    totalPrice:0,
    isLoading:true,
}

export const getCartItems = createAsyncThunk('cart/getCartItems', async () =>{
    try{
        const resp = await axios(url);
        return resp.data;
    } catch(error){
        console.log("data fetch fail:" + error)
    }
    
});

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers:{
        clearCart:(state)=>{
            state.cartItems = [];//mutate state directly with immer
        },
        removeItem:(state,action) =>{
            state.cartItems = state.cartItems.filter((item)=> item.id !== action.payload)
        },
        increase:(state,action) =>{
            const cartItem = state.cartItems.find((item) => item.id === action.payload)
            cartItem.amount = cartItem.amount + 1
        },
        decrease:(state,action) =>{
            const cartItem = state.cartItems.find((item) => item.id === action.payload)
            if(cartItem.amount === 0) return;
            cartItem.amount = cartItem.amount - 1
        },
        calculateTotals:(state) =>{
            let amount = 0;
            let total = 0;
            state.cartItems.forEach((item)=>{
                amount += item.amount;
                total += item.amount * item.price;
            })
            state.totalAmount = amount;
            state.totalPrice = total;
        }
    },
    extraReducers: (builder) =>{
        builder.addCase(getCartItems.pending, (state) => {
            state.isLoading = true;
        }).addCase(getCartItems.fulfilled, (state, action) => {
            state.isLoading = false;
            state.cartItems = action.payload;
        }).addCase(getCartItems.rejected,  (state) => {
            state.isLoading = false;
        })
    }
})

//console.log(cartSlice)

export const {clearCart, removeItem, increase, decrease, calculateTotals} = cartSlice.actions;

export default cartSlice.reducer;