from langchain_groq import ChatGroq
from app.core.config import settings
import json
import hashlib
from functools import lru_cache
from app.core.config import Settings

_ai_cache=dict[str,str]={}

### to generate summary
def generate_summary(content: str) -> str:
    try:
        llm = ChatGroq(api_key=settings.GORQ_API_KEY, temperature=0,model_name="llama-3.1-8b-instant")
        prompt = f"Summarize this blog post in exactly two sentences for SEO: {content[:2000]}"
        response = llm.invoke(prompt)
        return response.content

    except Exception as e:
        print(f"Error initializing ChatGroq: {e}")
        return None



###its comes after so if its unstructre 

##cache_key
def _cache_key(feature: str, content: str) -> str:
    h = hashlib.md5(content.encode()).hexdigest()
    return f"ai:{feature}:{h}"

    