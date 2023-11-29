using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.Extensions
{
    public static class ProductExtensions
    {
        public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy)
        {
            if (string.IsNullOrWhiteSpace(orderBy))
            {
                return query.OrderBy(q => q.Name);
            }

            query = orderBy switch 
            {
                "price" => query.OrderBy(q => q.Price),
                "priceDesc" => query.OrderByDescending(q => q.Price),
                _ => query.OrderBy(q => q.Name)
            };

            return query;
        }

        public static IQueryable<Product> Search(this IQueryable<Product> query, string searchTerm)
        {

            if(string.IsNullOrWhiteSpace(searchTerm))
            {
                return query;
            }

            var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

            return query.Where(q => q.Name.ToLower().Contains(lowerCaseSearchTerm) || q.Description.ToLower().Contains(lowerCaseSearchTerm));
            
        }
    }
}