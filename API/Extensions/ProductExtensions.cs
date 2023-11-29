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
    }
}