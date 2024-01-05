using API.DTOs;
using API.Entities.OrderAggregation;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class OrderExtensions
    {
        public static IQueryable<OrderDto> ProjectOrder(this IQueryable<Order> query)
        {
            return query.Select(order => new OrderDto 
            {
                Id = order.Id,
                BuyerId = order.BuyerId,
                OrderDate = order.OrderDate,
                ShippingAddress = order.ShippingAddress,
                DeliveryFee = order.DeliveryFee,
                SubTotal = order.SubTotal,
                Total = order.CalcTotal(),
                OrderStatus = order.OrderState.ToString(),
                OrderItems = order.OrderItems.Select(item => new OrderItemDto
                {
                    ProductId = item.ItemOrdered.ProductId,
                    Name = item.ItemOrdered.Name,
                    PictureUrl = item.ItemOrdered.PictureUrl,
                    Price = item.Price,
                    Quantity = item.Quantity

                }).ToList()
            }).AsNoTracking();
        }
    }
}