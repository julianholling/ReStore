using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using API.Services;
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
        private readonly ImageService _imageService;

        public ProductsController(StoreContext context, IMapper mapper, ImageService imageService)
        {
            _context = context;
            _mapper = mapper;
            _imageService = imageService;
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
        public async Task<ActionResult<Product>> CreateProduct([FromForm] CreateProductDto productDto)
        {

            var product = _mapper.Map<Product>(productDto);

            if(productDto.File is not null)
            {
                var imageResult = await _imageService.AddImageAsync(productDto.File);

                if(imageResult.Error is not null)
                {
                    return BadRequest(new ProblemDetails {Title = imageResult.Error.Message});
                }

                product.PictureUrl = imageResult.SecureUrl.ToString();
                product.PublicId = imageResult.PublicId;
            }
            
            _context.Products.Add(product);

            var result = await _context.SaveChangesAsync() > 0;

            if(result) 
            {
                return CreatedAtRoute("GetProduct", new {Id = product.Id}, product);
            }

            return BadRequest(new ProblemDetails {Title = "Error creating new product"});

        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<ActionResult<Product>> UpdateProduct([FromForm] UpdateProductDto productDto)
        {

            var product = await _context.Products.FindAsync(productDto.Id);

            if (product is null)
            {
                return NotFound();
            }

            _mapper.Map(productDto, product);

            if(productDto.File is not null)
            {
                var imageResult = await _imageService.AddImageAsync(productDto.File);
                if(imageResult.Error is not null)
                {
                    return BadRequest(new ProblemDetails {Title = imageResult.Error.Message});
                }

                if(!string.IsNullOrWhiteSpace(product.PublicId))
                {
                    await _imageService.DeleteImageAsync(product.PublicId);
                }

                product.PictureUrl = imageResult.SecureUrl.ToString();
                product.PublicId = imageResult.PublicId;

            }

            var result = await _context.SaveChangesAsync() > 0;

            if(result)
            {
                return Ok(product);
            }

            return BadRequest(new ProblemDetails{Title = "Error updating product"});

        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if(product is null)
            {
                return NotFound();
            }

            if (!string.IsNullOrWhiteSpace(product.PublicId))
            {
                await _imageService.DeleteImageAsync(product.PublicId);
            }

            _context.Products.Remove(product);

            var result = await _context.SaveChangesAsync() > 0;

            if(result)
            {
                return Ok();
            }

            return BadRequest(new ProblemDetails {Title = "Error deleting product"});
        }
    
    }
}