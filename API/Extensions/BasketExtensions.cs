using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class BasketExtensions
    {
        public static BasketDto MapBasketToDto(this Basket basket)
        {
            return new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                PaymentIntentId = basket.PaymentIntentId,
                ClientSecret = basket.ClientSecret,
                Items = basket.Items.Select(bi => new BasketItemDto
                {
                    ProductId = bi.ProductId,
                    Name = bi.Product.Name,
                    Price = bi.Product.Price,
                    PictureUrl = bi.Product.PictureUrl,
                    type = bi.Product.Type,
                    Brand = bi.Product.Brand,
                    Quantity = bi.Quantity,
                }).ToList()
            };
        }

        public static IQueryable<Basket> RetrieveBaskets(this IQueryable<Basket> query, string buyerId)
        {
            var baskets = query
                .Include(b => b.Items)
                    .ThenInclude(i => i.Product)
                .Where(b => b.BuyerId == buyerId);

            return baskets;
        } 
    }

}