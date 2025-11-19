using Microsoft.EntityFrameworkCore;
using MoveU.Domain.Interfaces;
using MoveU.Infrastructure.Data;
using System.Linq.Expressions;

namespace MoveU.Infrastructure.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly MoveUDbContext _context;
        public GenericRepository(MoveUDbContext context) { _context = context; }

        public async Task AddAsync(T entity) => await _context.Set<T>().AddAsync(entity);
        public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate) =>
            await _context.Set<T>().Where(predicate).ToListAsync();
        public async Task<IEnumerable<T>> GetAllAsync() => await _context.Set<T>().ToListAsync();
        public async Task<T?> GetByIdAsync(int id) => await _context.Set<T>().FindAsync(id);
        public void Remove(T entity) => _context.Set<T>().Remove(entity);
        public void Update(T entity) => _context.Set<T>().Update(entity);
    }
}
