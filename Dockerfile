FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar project files
COPY ["MoveU.Api/MoveU.Api.csproj", "MoveU.Api/"]
COPY ["MoveU.Application/MoveU.Application.csproj", "MoveU.Application/"]
COPY ["MoveU.Domain/MoveU.Domain.csproj", "MoveU.Domain/"]
COPY ["MoveU.Infrastructure/MoveU.Infrastructure.csproj", "MoveU.Infrastructure/"]

# Restaurar dependencias
RUN dotnet restore "MoveU.Api/MoveU.Api.csproj"

# Copiar todo el código
COPY . .

# Publicar la aplicación
WORKDIR "/src/MoveU.Api"
RUN dotnet publish "MoveU.Api.csproj" -c Release -o /app/publish

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Exponer puerto
EXPOSE 8080
EXPOSE 8081

# Comando de inicio
ENTRYPOINT ["dotnet", "MoveU.Api.dll"]
