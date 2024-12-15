import React from 'react'
import { useState } from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function PaginationComponent({totalPages,currentPage,setPage}) {
    //Sayfalama yapısı Material Designdan alındı propslar alarak sayfayı günceller
  return (
    <Stack spacing={3} className="mt-4 flex justify-center">
    <Pagination
      count={totalPages}
      page={currentPage}
      onChange={(event, value) => setPage(value)}
      color="primary"
    />
  </Stack>
  )
}
