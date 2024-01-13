using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregation;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace API.Controllers
{

    public class PaymentsController : BaseApiController
    {
        private readonly PaymentService _paymentService;
        private readonly StoreContext _context;
        private readonly IConfiguration _config;
        public PaymentsController(PaymentService paymentService, StoreContext context, IConfiguration config)
        {
            _paymentService = paymentService;
            _context = context;
            _config = config;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
        {
            var basket = await _context.Baskets.RetrieveBaskets(User.Identity.Name).FirstOrDefaultAsync();

            if (basket is null)
            {
                return NotFound();
            }

            var intent = await _paymentService.CreatOrUpdatePaymentIntent(basket);

            if(intent is null) 
            {
                return BadRequest(new ProblemDetails{Title = "Problem creating payment intent"});
            }

            basket.PaymentIntentId =  basket.PaymentIntentId ?? intent.Id;
            basket.ClientSecret = basket.ClientSecret ?? intent.ClientSecret;

            _context.Update(basket);

            var result = await _context.SaveChangesAsync() > 0;

            if(!result)
            {
                return BadRequest(new ProblemDetails {Title = "Problem updating basket with intent"});
            }

            return basket.MapBasketToDto();
        }

        [HttpPost("stripe-webhook")]
        public async Task<ActionResult> StripeWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            var webHookSecret = _config["StripeSettings:WhSecret"];

            var stripeEvent = 
                EventUtility
                    .ConstructEvent(json, Request.Headers["Stripe-Signature"], webHookSecret);

            var charge = stripeEvent.Data.Object as Charge;     //  Might need to cast rather than use AS !!!

            var order = await _context.Orders.FirstOrDefaultAsync(o => o.PaymentIntentId == charge.PaymentIntentId);

            if (charge.Status == "succeeded")
            {
                order.OrderState = OrderStatus.PaymentReceived;
            }

            await _context.SaveChangesAsync();

            return new EmptyResult();
        } 
    }
}