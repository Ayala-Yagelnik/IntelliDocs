using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using IntelliDocs.Core.IServices;

namespace IntelliDocs.Service.services
{
    public class EmbeddingService:IEmbeddingService
    {
        private readonly HttpClient _httpClient;

        public EmbeddingService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public Task<double> CalculateSimilarityAsync(List<float> embedding1, List<float> embedding2)
        {
            throw new NotImplementedException();
        }

        public Task<List<float>> GenerateEmbeddingsAsync(string text)
        {
            throw new NotImplementedException();
        }

        public async Task<float[]> GetEmbeddingAsync(string text)
        {
            var requestBody = new { text };
            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("http://localhost:5000/embed", content);
            response.EnsureSuccessStatusCode();

            var responseBody = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<EmbeddingResponse>(responseBody);

            return result.Embedding;
        }

        public Task SaveEmbeddingsAsync(string id, List<float> embeddings)
        {
            throw new NotImplementedException();
        }

        private class EmbeddingResponse
        {
            public float[] Embedding { get; set; }
        }
    }
}