import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from '../DataTable/DataTable';
import PaginationComponent from '../Pagination/Pagination';
import rickandmorty from '../../assets/rickandmorty.png'
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Button,
} from '@mui/material';

export default function DataList() {
  const [allData, setAllData] = useState([]); // Tüm verileri tutan state
  const [filteredData, setFilteredData] = useState([]); // Filtrelenmiş veriler
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({ name: '', status: '', species: '', gender: '' });
  const [sortBy, setSortBy] = useState('id'); // Varsayılan id'ye göre sıralama
  const [sortOrder, setSortOrder] = useState('asc'); // Varsayılan sıralama düzeni

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      let results = [];
      let nextPage = 1;
      let hasNextPage = true;

      while (hasNextPage) {
        const response = await axios.get(`https://rickandmortyapi.com/api/character?page=${nextPage}`);
        results = [...results, ...response.data.results];
        nextPage++;
        hasNextPage = response.data.info.next !== null;
      }

      setAllData(results);
      setFilteredData(results);
      setTotalPages(Math.ceil(results.length / pageSize));
    } catch (err) {
      console.error(err);
      setError('Veriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []); // Component mount olduğunda veri çekme işlemi

  useEffect(() => {
    applyFilters();
  }, [filters, page, pageSize, sortBy, sortOrder]); // Sıralama ve filtreleme her değiştiğinde çalışacak

  const applyFilters = () => {
    let filtered = allData.filter((item) => {
      return (
        (!filters.name || item.name.toLowerCase().includes(filters.name.toLowerCase())) &&
        (!filters.status || item.status.toLowerCase() === filters.status.toLowerCase()) &&
        (!filters.species || item.species.toLowerCase().includes(filters.species.toLowerCase())) &&
        (!filters.gender || item.gender.toLowerCase() === filters.gender.toLowerCase())
      );
    });

    // Sıralama işlemi
    if (sortBy && sortOrder) {
      filtered = filtered.sort((a, b) => {
        if (sortBy === 'id') {
          return sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
        } else if (sortBy === 'name') {
          return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else if (sortBy === 'status') {
          return sortOrder === 'asc' ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
        }
        return 0;
      });
    }

    setTotalPages(Math.ceil(filtered.length / pageSize));
    setFilteredData(filtered);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  const handleSortChange = (e) => {
    const [field, order] = e.target.value.split('-');
    setSortBy(field);
    setSortOrder(order);
    setPage(1); // Sayfa başına dön
  };

  const resetFilters = () => {
    setFilters({ name: '', status: '', species: '', gender: '' });
    setPage(1);
  };

  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);
  console.log(paginatedData)

  return (
    <div className="flex flex-col items-center mt-24 gap-y-6">
      <img src={rickandmorty} className='w-52'/>

      {/* Filtre alanı */}
      <div className="grid grid-cols-2 gap-4 mb-4 w-full max-w-2xl">
        <TextField
          label="Name"
          variant="outlined"
          size="small"
          name="name"
          value={filters.name}
          onChange={handleFilterChange}
        />
        <TextField
          label="Status"
          variant="outlined"
          size="small"
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          placeholder="alive, dead, unknown"
        />
        <TextField
          label="Type"
          variant="outlined"
          size="small"
          name="species"
          value={filters.species}
          onChange={handleFilterChange}
        />
        <TextField
          label="Gender"
          variant="outlined"
          size="small"
          name="gender"
          value={filters.gender}
          onChange={handleFilterChange}
          placeholder="male, female, genderless, unknown"
        />
      </div>

      {/* Sıralama alanı */}
      <FormControl variant="outlined" className=" w-64 mb-4"> {/* Update 1: Added mb-4 */}
        <InputLabel>Sıralama</InputLabel>
        <Select
          value={`${sortBy}-${sortOrder}`}
          onChange={handleSortChange}
          label="Sıralama"
        >
          <MenuItem value="id-asc">Default (ID Increase)</MenuItem>
          <MenuItem value="name-asc">Name (A-Z)</MenuItem>
          <MenuItem value="name-desc">Name (Z-A)</MenuItem>
          <MenuItem value="status-asc">Status (A-Z)</MenuItem>
          <MenuItem value="status-desc">Status (Z-A)</MenuItem>
        </Select>
      </FormControl>

      {/* Sayfa boyutu seçici */}
      <div className='mt4'></div>
      <FormControl variant="outlined" className="mb-4 mt-6 w-32"> 
        <InputLabel className="text-gray-800">Sayfa Boyutu</InputLabel>
        <Select
          value={pageSize}
          onChange={handlePageSizeChange}
          label="Sayfa Boyutu"
          size="small"
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={30}>30</MenuItem>
        </Select>
      </FormControl>

      {/* Filtre sıfırlama butonu */}
      
        <Button variant="contained" color="primary" onClick={resetFilters} className="mb-4 mt-4">
          Reset Filters
        </Button>
     
      
      <h2 className="text-2xl font-bold text-brandcolor mb-4">Character Lists</h2>
      {/* Tablo */}
        {/*Eğer veri yoksa kullanıcıya mesaj gösterilir varsa tablo doldurulur */}
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : paginatedData.length === 0 && !loading ? (
        <div className=" bg-red-500 text-xl font-bold text-white">No results found matching your filters</div>
      ) : (
        <DataTable data={paginatedData} loading={loading} />
      )}

      {/* Pagination bileşeni */}
      <PaginationComponent
        
        totalPages={totalPages}
        currentPage={page}
        setPage={setPage}
      />
    </div>
  );
}

