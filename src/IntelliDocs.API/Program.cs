using IntelliDocs.Data;
using IntelliDocs.Core.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using IntelliDocs.Core.IRepositories;
using IntelliDocs.Data.Repositories;
using IntelliDocs.Core.IServices;
using IntelliDocs.Core;
using IntelliDocs.Service.Services;
using System.Text.Json.Serialization;
using IntelliDocs.Service.services;
using Amazon.S3;
using IntelliDocs.API;
using DotNetEnv;


var builder = WebApplication.CreateBuilder(args);

Env.Load("settings.env");

builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseMySql(Environment.GetEnvironmentVariable("CONNECTION_STRING"),
    ServerVersion.Parse("8.0.33-mysql"),
    mySqlOptions => mySqlOptions.EnableRetryOnFailure())
           .EnableSensitiveDataLogging()//this is for debugging purposes only, remove in production
           .LogTo(Console.WriteLine, LogLevel.Information);
    //  options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),

});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
             "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:4200",
            "http://intellidocs-server.onrender.com",
            "https://intellidocs-server.onrender.com",
            "http://intellidocs-client-app.onrender.com",
            "https://intellidocs-client-app.onrender.com",
            "http://intellidocs-manager-app.onrender.com",
            "https://intellidocs-manager-app.onrender.com"
         ) 
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials(); 
    });
});

//jwt extensions
builder.Services.AddAuthorization(options =>
      {
          options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
          options.AddPolicy("UserOrAdmin", policy => policy.RequireRole("User", "Admin"));
          options.AddPolicy("UserOnly", policy => policy.RequireRole("User"));
      });

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER"),
        ValidAudience =Environment.GetEnvironmentVariable("JWT_AUDIENCE"),
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_KEY")))
    };
});

builder.Services.AddControllers()
 .AddJsonOptions(options =>
 {
     options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
     options.JsonSerializerOptions.WriteIndented = true;
 });


builder.Services.AddEndpointsApiExplorer();

//swagger extensions
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "IntelliDocs API",
        Version = "v1",
        Description = "An ASP.NET Core Web API for managing files",
    });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter into field the word 'Bearer' followed by a space and the JWT value",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",

    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement {
    {
        new OpenApiSecurityScheme
        {
            Reference = new OpenApiReference
            {
                Type = ReferenceType.SecurityScheme,
                Id = "Bearer"
            }
        },
        new List<string> ()
    }});
});

//services extensions
builder.Services.AddScoped<IFolderService, FolderService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserFileService, UserFileService>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IRepositoryManager, RepositoryManager>();
builder.Services.AddScoped<IFileRepository, FileRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IFolderRepository,FolderRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<IS3Service, S3Service>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IEmbeddingService, EmbeddingService>();
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));
builder.Services.AddAutoMapper(typeof(MappingPostEntity));
builder.Services.AddHttpClient();
builder.Services.AddHttpClient<EmbeddingService>();
builder.Services.AddAWSService<IAmazonS3>();


// Add services to the container.
// builder.Services.AddEndpointsApiExplorer();
var app = builder.Build();


// Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "IntelliDocs API V1");
        c.RoutePrefix = string.Empty;
    });
// }

app.Use(async (context, next) =>
{
    context.Response.Headers["Content-Security-Policy"] = "script-src 'self' https://accounts.google.com";
    await next();
});

app.UseCors("AllowFrontend");
app.UseRouting();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
