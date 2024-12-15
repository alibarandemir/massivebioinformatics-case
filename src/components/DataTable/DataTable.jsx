import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
//columnların belirlenmesi apideki verilerin yapılarına göre
const columns = [
  {
    accessorKey: 'id',
    header: 'ID',
    enableSorting: true,
    cell: ({ row }) => <div className="sm:text-sm">{row.original.id}</div>,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    enableSorting: true,
    cell: ({ row }) => {
      const status = row.original.status;
      let textColor = '';
      let bgColor = '';
      switch (status.toLowerCase()) {
        case 'alive':
          textColor = 'text-green-700';
          bgColor = 'bg-green-100';
          break;
        case 'dead':
          textColor = 'text-red-700';
          bgColor = 'bg-red-100';
          break;
        case 'unknown':
          textColor = 'text-yellow-700';
          bgColor = 'bg-yellow-100';
          break;
        default:
          textColor = 'text-gray-700';
          bgColor = 'bg-gray-100';
      }
      return (
        <div className={`px-2 py-1 rounded ${textColor} ${bgColor}`}>
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: 'species',
    header: 'Species',
    enableSorting: true,
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => (row.original.type ? row.original.type : 'N/A'),
    enableSorting: true,
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
    enableSorting: true,
  },
  {
    accessorKey: 'origin.name',
    header: 'Origin',
    cell: ({ row }) => (
      <a
        href={row.original.origin.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
      >
        {row.original.origin.name}
      </a>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'location.name',
    header: 'Location',
    cell: ({ row }) => (
      <a
        href={row.original.location.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
      >
        {row.original.location.name}
      </a>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => (
      <img
        src={row.original.image}
        alt={row.original.name}
        className="w-16 h-16 rounded mx-auto sm:mx-0"
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'episode',
    header: 'Episodes',
    cell: ({ row }) => (
      <div className="max-w-xs mx-auto sm:mx-0">
        {row.original.episode.slice(0, 2).map((ep, index) => (
          <a
            key={index}
            href={ep}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline block"
          >
            Episode {index + 1}
          </a>
        ))}
        {row.original.episode.length > 2 && <span>...</span>}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'created',
    header: 'Created',
    cell: ({ row }) => new Date(row.original.created).toLocaleString(),
    enableSorting: true,
  },
];
export const DataTable = ({ data, loading }) => {
  const [selectedRowId, setSelectedRowId] = useState(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <table className="w-full table-fixed border-collapse border border-gray-300">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="border border-gray-300 p-2 text-left cursor-pointer"
                  onClick={() => header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: ' 🔼',
                    desc: ' 🔽',
                  }[header.column.getIsSorted()] || null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => {
            const isSelected = selectedRowId === row.original.id;
            return (
              <tr
                key={row.id}
                className={`cursor-pointer h-16 ${isSelected ? 'border-blue-500 border-2' : 'border-gray-300 border'}`}
                onClick={() => setSelectedRowId(isSelected ? null : row.original.id)}
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="border border-gray-300 p-2 whitespace-nowrap max-h-16"
                  >
                    <div className="overflow-hidden text-ellipsis">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {selectedRowId && (
        <div className="mt-6 p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
          <div className="flex flex-col md:flex-row">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <img
                src={data.find(row => row.id === selectedRowId).image}
                alt={data.find(row => row.id === selectedRowId).name}
                className="w-48 h-48 rounded-lg object-cover shadow-md"
              />
            </div>
            <div className="flex-grow">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Character Details</h2>
              {(() => {
                const selectedRow = data.find(row => row.id === selectedRowId);
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailItem label="ID" value={selectedRow.id} />
                    <DetailItem label="Name" value={selectedRow.name} />
                    <DetailItem label="Status" value={selectedRow.status} />
                    <DetailItem label="Species" value={selectedRow.species} />
                    <DetailItem label="Type" value={selectedRow.type || 'N/A'} />
                    <DetailItem label="Gender" value={selectedRow.gender} />
                    <DetailItem label="Origin" value={selectedRow.origin.name} />
                    <DetailItem label="Location" value={selectedRow.location.name} />
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="mb-2">
    <span className="font-semibold text-gray-700">{label}:</span>{' '}
    <span className="text-gray-600">{value}</span>
  </div>
);