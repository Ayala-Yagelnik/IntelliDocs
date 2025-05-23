namespace IntelliDocs.Core.IServices
{
    public interface IEmbeddingService
    {
        /// <summary>
        /// Generates embeddings for the given text.
        /// </summary>
        /// <param name="text">The input text to generate embeddings for.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the embeddings as a list of floats.</returns>
        Task<List<float>> GenerateEmbeddingsAsync(string text);

        /// <summary>
        /// Calculates the similarity between two embeddings.
        /// </summary>
        /// <param name="embedding1">The first embedding.</param>
        /// <param name="embedding2">The second embedding.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the similarity score.</returns>
        Task<double> CalculateSimilarityAsync(List<float> embedding1, List<float> embedding2);

        /// <summary>
        /// Saves the generated embeddings to a persistent storage.
        /// </summary>
        /// <param name="id">The identifier for the embeddings.</param>
        /// <param name="embeddings">The embeddings to save.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        Task SaveEmbeddingsAsync(string id, List<float> embeddings);

        /// <summary>
        /// Retrieves embeddings from the persistent storage by their identifier.
        /// </summary>
        /// <param name="id">The identifier of the embeddings to retrieve.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the retrieved embeddings.</returns>
        public Task<float[]> GetEmbeddingAsync(string text);
    }
}