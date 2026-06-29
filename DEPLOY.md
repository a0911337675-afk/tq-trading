# Deploy TQ Trading

## Recommended: Railway

1. Create a GitHub repository.
2. Upload this `stock` folder to the repository.
3. Go to Railway and create a new project from that GitHub repository.
4. Railway will use `railway.json` and run:

```text
Start Command: python app.py
```

5. In the Railway service, go to Settings -> Networking -> Public Networking.
6. Click Generate Domain to get a free Railway-provided domain.

## Notes

- `HOST=0.0.0.0` is the app default and is required for public hosting.
- `PORT` is provided by Railway automatically.
- The local SQLite file in `data/stock.db` is ignored by Git. The deployed site will recreate the database from `schema.sql` and import Markdown articles from `content/articles`.
- For long-term production use, move the database to a managed database service.
