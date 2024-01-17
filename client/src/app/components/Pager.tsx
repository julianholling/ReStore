import { Box, Typography, Pagination } from "@mui/material";
import { MetaData } from "../models/pagination";
import { useState } from "react";

interface Props {
    metaData: MetaData;
    onPageChange: (page: number) => void;
}

export default function Pager({metaData, onPageChange} : Props) {

    const {currentPage, totalPages, pageSize, totalCount } = metaData;
    const [pageNumber, setPageNumber] = useState(currentPage);

    function handlePageChange(page: number) {
        setPageNumber(page);
        onPageChange(page);
    }

    let firstItem : number = 0;
    firstItem = (currentPage-1) * pageSize + 1;
    if(firstItem > totalCount ){
        firstItem = totalCount
    }
    
    return (

        <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography>
                Displaying {firstItem} - {currentPage * pageSize > totalCount ? totalCount : (currentPage * pageSize)} of {totalCount} items
            </Typography>
            <Pagination 
                color='secondary' 
                size='large' 
                count={totalPages} 
                page={pageNumber}
                onChange= {(_e, page) => handlePageChange(page) }
            />

        </Box>

    )
}