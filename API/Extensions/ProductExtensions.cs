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

        public static IQueryable<Product> Filter(this IQueryable<Product> query, string brands, string types)
        {

            var brandList = new List<string>();
            var typeList = new List<string>();

            if(!string.IsNullOrWhiteSpace(brands))
            {
                brandList.AddRange(brands.ToLower().Replace(", ", ",").Split(',').ToList());
            }

            if(!string.IsNullOrWhiteSpace(types))
            {
                typeList.AddRange(types.ToLower().Replace(", ", ",").Split(',').ToList());
            }
            
            query = query.Where(q => !brandList.Any() || brandList.Contains(q.Brand.ToLower()));
            query = query.Where(q => !typeList.Any() || typeList.Contains(q.Type.ToLower()));

            return query;
        }
    }
}