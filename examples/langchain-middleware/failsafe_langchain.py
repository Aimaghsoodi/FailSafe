"""FailSafe LangChain Middleware"""

from typing import Optional, Callable, Any
from langchain.callbacks import BaseCallbackHandler
from failsafe import FailSafeClient


class FailSafeMiddleware:
    """Middleware to detect failures in LangChain agents."""

    def __init__(
        self,
        llm: Any,
        mode: str = 'block',
        api_key: Optional[str] = None,
        failure_handler: Optional[Callable] = None,
        confidence_threshold: float = 0.7,
        log_failures: bool = True
    ):
        self.llm = llm
        self.mode = mode
        self.confidence_threshold = confidence_threshold
        self.log_failures = log_failures
        self.failure_handler = failure_handler
        self.client = FailSafeClient(api_key=api_key) if api_key or log_failures else None
        self.llm.callbacks = [FailSafeCallback(self)]

    def check_output(self, output: str) -> dict:
        """Check LLM output for failures."""
        try:
            if not self.client:
                return {'blocked': False, 'failures': []}

            report = self.client.check(output)

            if not report or not report.failures:
                return {'blocked': False, 'failures': []}

            failures = [f for f in report.failures if f.confidence >= self.confidence_threshold]

            if self.log_failures and failures:
                for failure in failures:
                    self.client.log_failure(failure)

            if self.failure_handler:
                for failure in failures:
                    self.failure_handler(failure)

            return {
                'blocked': self.mode == 'block' and len(failures) > 0,
                'failures': failures
            }
        except Exception:
            return {'blocked': False, 'failures': []}


class FailSafeCallback(BaseCallbackHandler):
    """LangChain callback for FailSafe checking."""

    def __init__(self, middleware: FailSafeMiddleware):
        self.middleware = middleware

    def on_llm_end(self, response: Any, **kwargs: Any) -> None:
        """Check LLM output when it completes."""
        output = response.generations[0][0].text if response.generations else ""
        result = self.middleware.check_output(output)
        if result['blocked']:
            raise ValueError(f"Output blocked: failure detected")
