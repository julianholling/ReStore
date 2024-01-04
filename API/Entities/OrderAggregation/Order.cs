namespace API.Entities.OrderAggregation
{
    public class Order
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public ShippingAddress ShippingAddress { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.Now;
        public List<OrderItem> OrderItems { get; set; }
        public long SubTotal { get; set; }
        public long DeliveryFee { get; set; }
        public OrderStatus OrderState { get; set; } = OrderStatus.Pending;

        public long CalcTotal()
        {
            return SubTotal + DeliveryFee;
        }

    }
}