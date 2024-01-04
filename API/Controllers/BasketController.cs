using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
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
            var basket = await RetrieveBasket(GetBuyerId());
            if (basket is null)
            {
                return NotFound();
            }

            return basket.MapBasketToDto();
        }

        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
        {
            //  1.  Retrieve basket (create if not existing already)
            var basket = await RetrieveBasket(GetBuyerId());
            if(basket is null)
            {
                basket = CreateBasket();
            }

            //  2.  get product
            var product = await _context.Products.FindAsync(productId);
            if(product is null)
            {
                return BadRequest(new ProblemDetails{Title = "Product not found"});
            }

            //  3.  add item to basket
            basket.AddItem(product, quantity);
            
            //  4.  save changes
            var result = await _context.SaveChangesAsync() > 0;
            if(result)            
            {
                return CreatedAtRoute("GetBasket", basket.MapBasketToDto());
            }

            return BadRequest(new ProblemDetails{Title = "Problem saving item to basket"});
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {
            //  1.  retrieve basket 
            var basket = await RetrieveBasket(GetBuyerId());
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
                return Ok(basket.MapBasketToDto());
            }
            
            return BadRequest(new ProblemDetails{Title = "Problem removing item from the basket"});
        }

        private async Task<Basket> RetrieveBasket(string buyerId)
        {

            if(string.IsNullOrWhiteSpace(buyerId))
            {
                Response.Cookies.Delete("buyerId");
                return null;
            }

            return await
                    _context
                        .Baskets
                        .Include(x => x.Items)
                            .ThenInclude(x => x.Product)
                        .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
        }

        private Basket CreateBasket()
        {
            var buyerId = User.Identity?.Name;
            if(string.IsNullOrWhiteSpace(buyerId))
            {
                buyerId = Guid.NewGuid().ToString();
                var cookieOptions = new CookieOptions
                {
                    IsEssential = true, Expires = DateTime.UtcNow.AddDays(30)
                };
                Response.Cookies.Append("buyerId", buyerId, cookieOptions);

            }
            
            var basket = new Basket{BuyerId = buyerId};
            _context.Baskets.Add(basket);

            return basket;

        }

        private string GetBuyerId()
        {
            return User.Identity?.Name ?? Request.Cookies["buyerId"];
        }
    }
}