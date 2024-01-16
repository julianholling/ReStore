using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly StoreContext _context;
        private readonly IMapper _mapper;

        public ProductsController(StoreContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;    
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery]ProductParameters productParameters)
        {
            var query = _context
                .Products
                    .Sort(productParameters.OrderBy)
                    .Search(productParameters.SearchTerm)
                    .Filter(productParameters.Brands, productParameters.Types)
                    .AsQueryable();

            var products = await 
                PagedList<Product>
                    .ToPagedList(query, productParameters.PageNumber, productParameters.PageSize);

            Response.AddPaginationHeader(products.MetaData);

            return products;
        }

        [HttpGet("{id}", Name = "GetProduct")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if(product is null)
            {
                return NotFound();
            }
            
            return product;
        }

        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();
            var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();

            return Ok(new {brands, types});
        }
    
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct(CreateProductDto productDto)
        {

            var product = _mapper.Map<Product>(productDto);
            
            _context.Products.Add(product);

            var result = await _context.SaveChangesAsync() > 0;

            if(result) 
            {
                return CreatedAtRoute("GetProduct", new {Id = product.Id}, product);
            }

            return BadRequest(new ProblemDetails {Title = "Error creating new product"});

        }
    
    }
}