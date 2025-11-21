using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MoveU.Application.Interfaces;
using MoveU.Application.Services;
using MoveU.Domain.Interfaces;
using MoveU.Infrastructure.Data;
using MoveU.Infrastructure.UnitOfWork;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;

// ================================
//  JWT Settings
// ================================
var jwtSection = configuration.GetSection("Jwt");
var jwtKey = jwtSection["Key"];

if (string.IsNullOrWhiteSpace(jwtKey))
{
    if (builder.Environment.IsDevelopment())
    {
        jwtKey = "Development_Key_Minimo_32_Caracteres_Aqui_1234567890123456";
    }
    else
    {
        throw new InvalidOperationException("Jwt:Key no está configurado.");
    }
}

var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

// ================================
//  Add Services to DI
// ================================
builder.Services.AddControllers();

// DbContext
builder.Services.AddDbContext<MoveUDbContext>(options =>
    options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

// Dependency Injection – BACKEND COMPLETE
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IActivityPlanService, ActivityPlanService>();
builder.Services.AddScoped<ITokenService, TokenService>();

// ================================
//  Swagger + JWT Support
// ================================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "MoveU API",
        Version = "v1",
        Description = "API del proyecto MoveU (UNAD)"
    });

    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Ingrese: Bearer {JWT}",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Reference = new OpenApiReference
        {
            Id = "Bearer",
            Type = ReferenceType.SecurityScheme
        }
    };

    c.AddSecurityDefinition("Bearer", jwtSecurityScheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { jwtSecurityScheme, new string[] { } }
    });
});

// ================================
//  JWT Authentication
// ================================
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,

        ValidIssuer = jwtSection["Issuer"],
        ValidAudience = jwtSection["Audience"],

        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes),

        ClockSkew = TimeSpan.FromSeconds(30)
    };
});

// ================================
//  CORS (para React)
// ================================
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// ================================
//  Build App
// ================================
var app = builder.Build();

// ================================
//  Middlewares
// ================================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
