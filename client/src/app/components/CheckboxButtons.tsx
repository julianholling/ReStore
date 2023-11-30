import { FormControlLabel, FormGroup, Checkbox } from "@mui/material";
import { useState } from "react";

interface Props {
    items: string[];
    checked?: string[];
    onChange: (items: string[]) => void;

}


export default function CheckboxButtons({items, checked, onChange} : Props) {

    const [checkedItems, setCheckedItems] = useState(checked || []);

    function checkItemEventHandler(value: string) {
        const currentIndex = checkedItems.findIndex(item => item === value);
        let newCheckedItems: string[] = [];
        if(currentIndex === -1) {
            newCheckedItems = [...checkedItems, value]; //  Use spread operator to append the item into a new array
        }
        else {
            newCheckedItems = checkedItems.filter(item => item !== value);
        }
        setCheckedItems(newCheckedItems);
        onChange(newCheckedItems);

    }

    return (

        <FormGroup>
            {items.map(item => (
                <FormControlLabel 
                    control={
                        <Checkbox 
                            checked={checkedItems.indexOf(item) !== -1} 
                            onClick={() => checkItemEventHandler(item)} 
                        />} 
                    label={item} 
                    key={item} />    
            ))}
            
        </FormGroup>

    )

}