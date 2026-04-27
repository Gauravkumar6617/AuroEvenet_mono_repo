from langchain_groq import ChatGroq
from app.core.config import settings

def generate_summary(content: str) -> str:
    try:
        llm = ChatGroq(api_key=settings.GORQ_API_KEY, temperature=0,model_name="llama-3.1-8b-instant")
        prompt = f"Summarize this blog post in exactly two sentences for SEO: {content[:2000]}"
        response = llm.invoke(prompt)
        return response.content

    except Exception as e:
        print(f"Error initializing ChatGroq: {e}")
        return None
    