using System.Reflection.Metadata.Ecma335;
using API.Data;
using API.Entities;
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

        [HttpGet]
        public async Task<ActionResult<Basket>> GetBasket()
        {
            var basket = await 
                _context
                    .Baskets
                    .Include(x => x.Items)
                        .ThenInclude(x => x.Product)
                    .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
            if(basket is null)
            {
                return NotFound();
            }

            return basket;
        }

        [HttpPost]
        public async Task<ActionResult> AddItemToBasket(int productId, int quantity)
        {
            //  1.  Retrieve basket (create if not existing already)
            //  2.  get product
            //  3.  add item to basket
            //  4.  save changes
            return StatusCode(201);
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {
            //  1.  retrieve basket 
            //  2.  remove item (reduce quantity)
            //  3.  save changes
            return Ok();
        }

    }
}