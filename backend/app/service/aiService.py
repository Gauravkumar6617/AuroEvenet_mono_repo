from langchain_groq import ChatGroq
from app.core.config import Settings
import json
import hashlib
from typing import List

# ── In-memory cache (for learning/demo) ────────────────────────────────────────
_ai_cache: dict[str, str] = {}

# ── Single LLM instance (DO NOT recreate per request) ─────────────────────────
_llm = ChatGroq(
    api_key=Settings().GORQ_API_KEY,
    temperature=0,
    model_name="llama-3.1-8b-instant"
)

# ── Core Groq caller ──────────────────────────────────────────────────────────
def call_groq(prompt: str) -> str:
    try:
        response = _llm.invoke(prompt)
        return response.content.strip() if response else ""
    except Exception as e:
        print(f"[Groq Error]: {e}")
        return ""

# ── Cache helpers ─────────────────────────────────────────────────────────────
def _cache_key(feature: str, content: str) -> str:

    h = hashlib.md5(content.encode()).hexdigest()
    return f"ai:{feature}:{h}"

def _call_groq_cached(prompt: str, feature: str, content_key: str) -> str:
    key = _cache_key(feature, content_key)

    # cache hit
    if key in _ai_cache:
        return _ai_cache[key]

    # cache miss
    result = call_groq(prompt)

    # avoid caching empty/bad results
    if result:
        _ai_cache[key] = result

    # simple memory protection (optional)
    if len(_ai_cache) > 1000:
        _ai_cache.clear()

    return result



#####Ai Function

def summarize_comments(comments: List[str],max_length: int = 200) -> str:
    if not comments:
        return ""
    
    text = "\n".join(f"- {c}" for c in comments[:10])
    prompt = (
        f"Summarize these comments into a concise TL;DR under {max_length} chars:\n\n"
        f"{text}\n\nSummary:"
    )
    return _call_groq_cached(prompt, "comment_summary", text)



###to summraize debate
def summarize_debate(comment:List[str]) -> dict:
    if len(Comment)<6:
        return {"is_debate":False}
    text = "\n".join(f"- {c}" for c in comment[:20])
    prompt = f"""Analyze if these comments show a debate with two clear sides.
If yes, output JSON: {{ "is_debate":true,"side_a":"...","side_b":"..." ,"controversy_score":0-100}}
if no, output: {{"is_debate":false}}

Comments:
{text}"""
    result = _call_groq_cached(prompt, "debate_summary", text)
    try:
            return json.loads(result)
    except:
        return {"is_debate": False}


###to enchace post
def enchace_post(title:str,content:str)->dict:
    prompt=f"""Improve this blog post. output JSON:
{{
  "title": "catchier title",
  "content": "improved markdown content",
  "suggested_tags": ["tag1", "tag2", "tag3"],
  "improvements": ["made intro hook stronger", "fixed grammar"]
}}

Title:{{title}}
Content:{{content}}"""
    result = _call_groq_cached(prompt, "post_enhancement", f"{title}|{content}")
    try:
        return json.loads(result)
    except:
        return {"title": title, "content": content, "suggested_tags": [], "improvements": []}

### for suggesting tags
def suggest_tags(title:str,content_preview:str)->List[str]:
    prompt = f"""Given this blog post, suggest 3-5 relevant tags. Output JSON array of strings.
title:{title}
content_preview:{content_preview[:200]}

tags:"""
    result = _call_groq_cached(prompt, "tag_suggestion", f"{title}|{content_preview[:200]}")
    try:
        return json.loads(result)
    except:
        return ["AI","Technology","Innovation","Startup","Business"]

#to genertae question 
def generate_summary(post_content: str, max_length: int = 250) -> str:
    if not post_content:
        return ""
    text = post_content[:1000]
    prompt = (
        f"Summarize the following blog post in under {max_length} characters. "
        f"Return only the summary text.\n\n{text}\n\nSummary:"
    )
    return _call_groq_cached(prompt, "post_summary", text)


def generate_related_questions(post_title: str, post_content: str) -> List[str]:
    prompt = f"""Based on this blog post, generate 3 related questions a reader might explore next.
Output JSON array of strings.

Title: {post_title}
Content: {post_content[:500]}

Questions:"""
    result = _call_groq_cached(prompt, "related_questions", post_title)
    try:
        return json.loads(result)
    except Exception:
        return []


