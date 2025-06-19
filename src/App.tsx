import React, { useEffect, useState } from 'react';
import './App.css';
import { fetchData } from './api';

interface RecipeResponse {
    [key: string]: any;
}

function App() {
    const [data, setData] = useState<RecipeResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const token = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJQOVpLWnkyX2M3Sjh1aTJBcXRnTGk2NTNOTWVQcDBYbjg4Q1pHNjRjLVlnIn0.eyJleHAiOjE3NTAzNjc5MTIsImlhdCI6MTc1MDM2NjQxMiwianRpIjoiNGRmZWJiZGQtNzc4Ny00MTkyLTliOGQtYmJmMzNiNWRiMGViIiwiaXNzIjoiaHR0cHM6Ly9pYW0ua2FybmVkLmJ6aC9yZWFsbXMvS2FybmVkIiwiYXVkIjpbImthcm5lZCIsInJlYWxtLW1hbmFnZW1lbnQiLCJhcGktY3JlZGVudGlhbCIsImFwcC1yZWNpcGUiLCJhY2NvdW50IiwiYXBpLWxpY2Vuc2UiLCJhcGktcmVjaXBlIl0sInN1YiI6ImQzZjQ4YTQyLTBkMWUtNDI3MC04ZThlLTU0OTI1MWNkODIzZCIsInR5cCI6IkJlYXJlciIsImF6cCI6Imthcm5lZCIsInNpZCI6IjU3ODEzYzA2LWUxNGItNDQzNi05OTk5LTBkYjk4NTVlNjEwNCIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cHM6Ly9zYWtlLmthcm5lZC5iemgiLCJodHRwOi8vbG9jYWxob3N0Ojg1MDEiLCJodHRwOi8vbG9jYWxob3N0IiwiaHR0cDovL2xvY2FsaG9zdDo4MDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIiwiZGVmYXVsdC1yb2xlcy1rYXJuZWQiXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFsbS1tYW5hZ2VtZW50Ijp7InJvbGVzIjpbInZpZXctdXNlcnMiLCJxdWVyeS1ncm91cHMiLCJxdWVyeS11c2VycyJdfSwiYXBpLWNyZWRlbnRpYWwiOnsicm9sZXMiOlsibWluZSJdfSwiYXBwLXJlY2lwZSI6eyJyb2xlcyI6WyJyZWFkIiwidXBkYXRlIiwiY3JlYXRlIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX0sImFwaS1saWNlbnNlIjp7InJvbGVzIjpbIm1pbmUiXX0sImFwaS1yZWNpcGUiOnsicm9sZXMiOlsicmVhZCIsInVwZGF0ZSIsImNyZWF0ZSIsImRlbGV0ZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiS2lsbGlhbiBLT1BQIiwicHJlZmVycmVkX3VzZXJuYW1lIjoia2lsbGlhbiIsImdpdmVuX25hbWUiOiJLaWxsaWFuIiwiZmFtaWx5X25hbWUiOiJLT1BQIiwiZW1haWwiOiJraWxsaWFua29wcEBnbWFpbC5jb20ifQ.FFtbGLVStEdayRctbaHcTybfPvyaa4F_maleIZBAzhC3uE1KZuUbcEfLWjKAiHgF-zj-dN9MFtGRHjo3zgb8zTFROMQMSancxmNLPdDAXJTCR18tyZCSWLk8EXdG68blVjMKXrw_65dBOHtDvzdKdwkga4hlt3RUbUjJ2Yu9lI3OiW7tUeo99tp3fTwhalhy2tTgdOto7KNaBNHtjAm-YqNZie68j1cNV79w5X4m8Hf6QOl8UJVjqgpAsL0wXSmpqmIQ6KgPoqsBGYEi5TgwS1ZOoE4cXwqJ1s3_rXRGsKuzhLd85lcz960PzVKjN877EC8GLkuMnfaXTY1vDnQ8pg';
    const licenseKey = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';

    useEffect(() => {
        fetchData<RecipeResponse>('http://localhost:8010/recipe/v1', token, licenseKey)
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <p>Appel à l'API Karned</p>
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                {data && (
                    <div>
                        <h3>Réponse de l'API :</h3>
                        <pre>{JSON.stringify(data, null, 2)}</pre>
                    </div>
                )}
            </header>
        </div>
    );
}

export default App;
