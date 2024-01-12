using System.ComponentModel.DataAnnotations;

namespace API.Entities.OrderAggregation
{
    public class Order
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        [Required]
        public ShippingAddress ShippingAddress { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.Now;
        public List<OrderItem> OrderItems { get; set; }
        public long SubTotal { get; set; }
        public long DeliveryFee { get; set; }
        public OrderStatus OrderState { get; set; } = OrderStatus.Pending;
        public string PaymentIntentId { get; set; }

        public long CalcTotal()
        {
            return SubTotal + DeliveryFee;
        }

    }
}