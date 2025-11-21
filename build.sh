#!/bin/bash
echo "=== Building MoveU API ==="
dotnet restore
dotnet build -c Release --no-restore
dotnet publish -c Release -o output --no-build
echo "=== Build Complete ==="
