```
$sa_password = "123"
dotnet user-secrets set "ConnectionStrings:GameStoreContext" "Server=sa Database=GameStore; User Id=sa; Password=$sa_password;TrustServerCertificate=True"
```