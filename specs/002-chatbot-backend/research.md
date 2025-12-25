# Research & Decisions for "Interactive Textbook Backend"

This document records the rationale for key technical decisions made during the planning phase for the backend services.

## 1. Embedding Model for RAG

- **Decision**: We will use the `sentence-transformers/all-MiniLM-L6-v2` model.
- **Rationale**:
    - **Performance**: It offers a great balance between performance and computational cost. It is small enough to run efficiently while providing high-quality embeddings for retrieval tasks.
    - **Open Source & Availability**: It is a popular, open-source model available on Hugging Face, making it easy to integrate and use without incurring API costs for the embedding step.
    - **General Purpose**: It is a general-purpose model trained on a wide variety of data, making it suitable for embedding the content of a technical textbook.
- **Alternatives Considered**:
    - **OpenAI `text-embedding-ada-002`**: While a very powerful model, it requires API calls for embedding, which can increase operational costs and latency during the data ingestion phase. We can consider upgrading to this if the open-source model's performance is insufficient.
    - **Other open-source models**: Larger models like `all-mpnet-base-v2` offer slightly better performance but at a higher computational cost. `all-MiniLM-L6-v2` is the ideal starting point.

## 2. Translation Service API

- **Decision**: We will use the **Google Translate API**.
- **Rationale**:
    - **Quality & Language Support**: Google Translate offers high-quality translations and has excellent support for a vast number of languages, including Urdu.
    - **Scalability & Reliability**: It is a highly scalable and reliable service backed by Google's infrastructure.
    - **Ease of Integration**: Google Cloud provides a well-documented Python client library (`google-cloud-translate`), which will make integration with our FastAPI backend straightforward.
- **Alternatives Considered**:
    - **DeepL API**: Known for its high-quality, nuanced translations. However, its language support might be slightly less extensive, and its pricing model may differ.
    - **Microsoft Translator API**: Another strong competitor, but Google's offering is often considered the industry standard for broad language support.
    - **Self-hosted models (e.g., Helsinki-NLP)**: While this would avoid external API costs, self-hosting a high-quality translation model is complex, resource-intensive, and out of scope for this project.

## 3. Architecture Diagram

```mermaid
graph TD
    subgraph Frontend
        A[Docusaurus Site]
    end
    subgraph Backend (FastAPI on Vercel)
        B(API Gateway)
        C(Auth Service)
        D(Chat Service)
        E(Translate Service)
    end
    subgraph External Services
        F[Better-Auth.com]
        G[OpenAI API]
        H[Google Translate API]
        I[Qdrant Cloud]
        J[Neon Serverless Postgres]
    end

    A -- /api/auth --> B
    A -- /api/chat --> B
    A -- /api/translate --> B
    B --> C
    B --> D
    B --> E
    C <--> F
    D -- User Question --> G
    D -- Retrieved Chunks --> G
    D -- Embed Question --> I
    E <--> H
    C -- User Profile --> J
```
This diagram outlines the high-level architecture. The Docusaurus frontend communicates with a FastAPI backend hosted on Vercel. The backend is composed of modular services for Auth, Chat, and Translation, which in turn connect to the required external PaaS/SaaS providers.
