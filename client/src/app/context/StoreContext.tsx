
import { PropsWithChildren, createContext, useContext, useState } from "react";
import { Basket } from "../models/basket";

interface StoreContextValue {
    basket: Basket | null;
    setBasket: (basket : Basket) => void;
    removeItem: (productId: number, quantity: number) => void;
}

//  Note.  createContext MUST come from react librarues and not anywhere else
export const StoreContext = createContext<StoreContextValue | undefined>(undefined);

//  define a bespoke hook !!!
// eslint-disable-next-line react-refresh/only-export-components
export function useStoreContext() {
    const context = useContext(StoreContext);

    if(context === undefined){
        throw Error('Oops - we do noy seem to be inside the provider.');
    }

    return context;
}

export function StoreProvider({children}: PropsWithChildren<any>){
    const [basket, setBasket] = useState<Basket | null>(null);

    function removeItem(productId: number, quantity: number){
        if(!basket){
            return;
        }

        const items = [...basket.items];        //  The spread operator creates a NEW copy of the array
        const itemIndex = items.findIndex(i => i.productId === productId);
        if(itemIndex >= 0){
            items[itemIndex].quantity -= quantity;
            if(items[itemIndex].quantity === 0){
                items.splice(itemIndex, 1);
            }
            setBasket(prevState => {
                return {...prevState!, items}
            })
        }
    }

    return (
        <StoreContext.Provider value={{basket, setBasket, removeItem}}>
            {children}
        </StoreContext.Provider>
    )
}