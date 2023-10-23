import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box } from "@mui/material";
import { Add, Delete, Remove } from "@mui/icons-material";
import { useStoreContext } from "../../app/context/StoreContext";
import agent from "../../app/api/agent";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";

export default function BasketPage(){

   const {basket, setBasket, removeItem} = useStoreContext();
   const [loading, setLoading] = useState(false);

   function addItemEventHandler(productId : number) {
      setLoading(true);
      agent.Basket.addItem(productId)
        .then(basket => setBasket(basket))
        .catch(error => console.log(error))
        .finally(() => setLoading(false));
   }

   function removeItemEventHandler(productId : number, quantity = 1) {
      setLoading(true);
      agent.Basket.removeItem(productId, quantity)
        .then(() => removeItem(productId, quantity))
        .catch(error => console.log(error))
        .finally(() => setLoading(false));

   }

    if(!basket)
    {
        return <Typography variant='h3'>Your basket is empty</Typography>
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {basket.items.map(item => (
                        <TableRow
                            key={item.productId}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                <Box display='flex' alignItems='center'>
                                    <img src={item.pictureUrl} alt={item.name} style={{height: 50, marginRight: 20}} />
                                    <span>{item.name}</span>
                                </Box>
                            </TableCell>
                            <TableCell align="right">${(item.price / 100).toFixed(2)}</TableCell>
                            <TableCell align="center">
                                <LoadingButton color="error" loading={loading} onClick={() => removeItemEventHandler(item.productId)}>
                                    <Remove />
                                </LoadingButton>
                                {item.quantity}
                                <LoadingButton color="secondary"  loading={loading} onClick={() => addItemEventHandler(item.productId)}>
                                    <Add />
                                </LoadingButton> 
                                
                            </TableCell>
                            <TableCell align="right">${((item.price * item.quantity) / 100).toFixed(2)}</TableCell>
                            <TableCell align="right">
                                <LoadingButton color="error" loading={loading} onClick={() => removeItemEventHandler(item.productId, item.quantity)}>
                                    <Delete />
                                </LoadingButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}