using API.DTOs;
using API.Entities;

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
                Items = basket.Items.Select(bi => new BasketItemDto
                {
                    ProductId = bi.ProductId,
                    Name = bi.Product.Name,
                    Price = bi.Product.Price,
                    PictureUrl = bi.Product.PictureUrl,
                    type = bi.Product.Type,
                    Brand = bi.Product.Brand,
                    Quantity = bi.Quantity
                }).ToList()
            };
        }  
    }

}