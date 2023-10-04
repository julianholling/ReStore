using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;

        public BasketController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet(Name ="GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await RetrieveBasket();
            if (basket is null)
            {
                return NotFound();
            }

            //  Perhaps we could look at using AutoMapper here?
            return MapBasketToDto(basket);
        }

        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
        {
            //  1.  Retrieve basket (create if not existing already)
            var basket = await RetrieveBasket();
            if(basket is null)
            {
                basket = CreateBasket();
            }

            //  2.  get product
            var product = await _context.Products.FindAsync(productId);
            if(product is null)
            {
                return NotFound();
            }

            //  3.  add item to basket
            basket.AddItem(product, quantity);
            
            //  4.  save changes
            var result = await _context.SaveChangesAsync() > 0;
            if(result)            
            {
                return CreatedAtRoute("GetBasket", MapBasketToDto(basket));
            }

            return BadRequest(new ProblemDetails{Title = "Problem saving item to basket"});
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {
            //  1.  retrieve basket 
            var basket = await RetrieveBasket();
            if(basket is null)
            {
                return NotFound();
            }

            //  2.  remove item (reduce quantity)
            basket.RemoveItem(productId, quantity);

            //  3.  save changes

            var result = await _context.SaveChangesAsync() > 0;
            if(result)
            {
                return Ok();
            }
            
            return BadRequest(new ProblemDetails{Title = "Problem removing item from the basket"});
        }

        private async Task<Basket> RetrieveBasket()
        {
            return await
                    _context
                        .Baskets
                        .Include(x => x.Items)
                            .ThenInclude(x => x.Product)
                        .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
        }

        private Basket CreateBasket()
        {
            var buyerId = Guid.NewGuid().ToString();
            var cookieOptions = new CookieOptions
            {
                IsEssential = true, Expires = DateTime.UtcNow.AddDays(30)
            };
            Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            var basket = new Basket{BuyerId = buyerId};
            _context.Baskets.Add(basket);

            return basket;

        }

        private static ActionResult<BasketDto> MapBasketToDto(Basket basket)
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