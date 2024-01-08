using System.Runtime.CompilerServices;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregation;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly StoreContext _context;
        public OrdersController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<OrderDto>>> GetOrders()
        {
            return await _context
                .Orders 
                    .ProjectOrder()
                .Where(x => x.BuyerId == User.Identity.Name)
                .ToListAsync();
        }

        [HttpGet("{id}", Name = "GetOrder")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            return await _context
                .Orders
                    .ProjectOrder()
                .Where(x => x.BuyerId == User.Identity.Name && x.Id == id)
                .FirstOrDefaultAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(CreateOrderDto orderDto)
        {
            var basket = await _context
                .Baskets
                .RetrieveBaskets(User.Identity.Name)
                .FirstOrDefaultAsync();

            if(basket is null) 
            {
                return BadRequest(new ProblemDetails{Title = "Could not locate Basket"});
            }

            var items = new List<OrderItem>(basket.Items.Count);

            foreach(var item in basket.Items)
            {
                var productItem = await _context.Products.FindAsync(item.ProductId);
                var itemOrdered = new ProductItemOrdered 
                {
                    ProductId = productItem.Id,
                    Name = productItem.Name,
                    PictureUrl = productItem.PictureUrl,

                };

                var orderItem = new OrderItem
                {
                    ItemOrdered = itemOrdered,
                    Price = productItem.Price,
                    Quantity = item.Quantity,

                };

                items.Add(orderItem);
                productItem.QuantityInStock -= item.Quantity;
            }

            var subTotal = items.Sum(i => i.Price * i.Quantity);
            var deliveryFee = subTotal > 10000 ? 0 : 500;

            var order = new Order 
            {
                OrderItems = items,
                BuyerId = User.Identity.Name,
                ShippingAddress = orderDto.ShippingAddress,
                SubTotal = subTotal,
                DeliveryFee = deliveryFee
            };

            _context.Orders.Add(order);
            _context.Baskets.Remove(basket);

            if(orderDto.SaveAddress)
            {
                var user = await _context
                    .Users
                        .Include(u => u.Address)
                    .FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);

                    var address = new UserAddress
                    {
                        City = orderDto.ShippingAddress.City,
                        Country = orderDto.ShippingAddress.Country,
                        FullName = orderDto.ShippingAddress.FullName,
                        Line1 = orderDto.ShippingAddress.Line1,
                        Line2 = orderDto.ShippingAddress.Line2,
                        State = orderDto.ShippingAddress.State,
                        Zip = orderDto.ShippingAddress.Zip,
                    };

                user.Address = address;
                
            }

            var result = await _context.SaveChangesAsync() > 0;

            if(result)
            {
                return CreatedAtRoute("GetOrder", new {id = order.Id}, order.Id);
            }

            return BadRequest("Problem occurred when creating order.");

        }
    }
}

