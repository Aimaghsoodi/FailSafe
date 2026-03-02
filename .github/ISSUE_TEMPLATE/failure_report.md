---
name: Failure report
about: Report a failure scenario or vulnerability in agent safety
title: "[FAILURE] "
labels: safety, failure-mode
assignees: ''
---

## Failure description
A clear description of the failure mode or vulnerability you've discovered.

## Severity level
- [ ] Critical (system compromised, data loss, irreversible harm)
- [ ] High (significant safety impact, workaround exists)
- [ ] Medium (moderate safety concern, limited impact)
- [ ] Low (minor safety issue, easily mitigated)

## How it manifests
Steps to trigger or reproduce the failure:
1. Step 1
2. Step 2
3. ...

## Expected safe behavior
What should happen to prevent this failure mode?

## Actual unsafe behavior
What actually happens instead?

## Impact analysis
- **Agent impact:** How does this affect agent behavior?
- **User impact:** How does this affect users?
- **System impact:** How does this affect the broader system?

## Proof of concept
If applicable, provide a minimal code example or configuration that triggers the failure:

```typescript
// TypeScript example
```

```python
# Python example
```

## Suggested mitigation
How could this failure be prevented or contained?

## Environment
- OS: [e.g., macOS 13.0, Ubuntu 22.04, Windows 11]
- Node version: [e.g., 18, 20, 22]
- Python version: [if applicable, e.g., 3.11]
- Package version: [e.g., @failsafe/core@0.1.0]

## Additional context
Add any other context, logs, error traces, or references to related safety literature here.

## Disclosure
- [ ] I agree to responsible disclosure
- [ ] This is a security issue that should not be publicly discussed yet
