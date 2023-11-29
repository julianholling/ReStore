namespace API.RequestHelpers
{
    public class ProductParameters : PaginationParameters
    {
        public string OrderBy { get; set; }
        public string SearchTerm { get; set; }
        public string Brands { get; set; }
        public string Types { get; set; }
    }
}