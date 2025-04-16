import React from "react";
import { Box, Pagination } from "@mui/material";

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <Box display="flex" justifyContent="center" mt={4}>
            <Pagination count={totalPages} page={currentPage} onChange={(event, value) => onPageChange(value)} color="primary"
                shape="rounded" size="large"/>
        </Box>
    );
};

export default PaginationControls;