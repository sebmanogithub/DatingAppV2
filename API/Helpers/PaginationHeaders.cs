using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class PaginationHeaders
    {
        public PaginationHeaders(int currentPage, int itemsPerPage,
        int totalItems, int totalPages) 
        {
            CurrentPage = currentPage;
            TotalPages = totalPages;
            ItemsPerPage = itemsPerPage;
            TotalItems = totalItems;
        }
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int ItemsPerPage { get; set; }
        public int TotalItems { get; set; }
    }
}