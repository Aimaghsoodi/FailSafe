# LangChain + FailSafe Middleware

Add automatic AI failure detection to LangChain agents via FailSafe middleware.

## What This Does

- Detects hallucinations, reasoning errors, safety violations
- Blocks dangerous outputs before agent execution
- Logs failures to FailSafe database
- Provides fallback behaviors

## Installation

```bash
pip install langchain openai failsafe
```

## Usage

```python
from failsafe_langchain import FailSafeMiddleware

middleware = FailSafeMiddleware(llm, mode='block')
agent = initialize_agent(tools, middleware.llm, ...)
```

## Detected Failures

- Hallucinations (factual, citation, numerical)
- Reasoning errors (logical, mathematical)
- Safety violations
- Tool misuse and output quality issues

## Configuration

```python
# Block mode
middleware = FailSafeMiddleware(llm, mode='block')

# Warn mode
middleware = FailSafeMiddleware(llm, mode='warn')

# Custom threshold
middleware = FailSafeMiddleware(
    llm,
    confidence_threshold=0.8
)
```

## Monitoring

```python
from failsafe import FailSafeClient

client = FailSafeClient(api_key="your-key")
stats = client.get_stats()
failures = client.query_failures(limit=100)
```

## See Also

- Implementation: `failsafe_langchain.py`
- FailSafe: https://github.com/Aimaghsoodi/FailSafe
