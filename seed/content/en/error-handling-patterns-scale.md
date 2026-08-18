---
title: "Error Handling Patterns That Scale"
slug: "error-handling-patterns-scale"
translationKey: "error-handling-patterns-guide"
locale: "en"
excerpt: "A field-notes guide to errors as values versus exceptions, where to catch versus propagate, and how to wire correlation IDs so failures are traceable."
category: "software-engineering"
tags: ["best-practices", "code-quality", "observability", "backend"]
publishedAt: "2026-08-18"
seoTitle: "Error Handling Patterns That Scale"
seoDescription: "A field-notes guide to errors as values versus exceptions, where to catch versus propagate, and how to wire correlation IDs so failures are traceable."
---

Short answer: return errors as values for expected, in-band failures (bad input, missing record), and reserve exceptions for genuinely unrecoverable or programmer-error conditions. Mixing the two makes it impossible to tell, mid call-stack, which failure is routine and which one is an emergency. These are the patterns I keep returning to after debugging the same class of incident more than once.

## Should I use error values or exceptions?

Short answer: use error values for failures that are part of a function's normal contract — invalid input, a record that does not exist, a payment that got declined — and use exceptions for programmer errors or truly unrecoverable states like out-of-memory or a broken invariant. As of August 2026, languages like Go, Rust, and Zig default to value-based errors, and that's not an accident: it keeps the failure path visible in the type signature instead of hidden in documentation.

The real cost of exceptions isn't performance — stack unwinding overhead is usually overstated on modern JIT runtimes. The real cost is invisible control flow: you cannot look at a signature and know what it might throw, so you end up trusting docs that go stale. With value-based errors the failure is part of the signature, and a linter can flag a caller who forgets to handle it.

My honest take: using exceptions for expected control flow — throwing `NotFoundException` for a routine "user not found" and catching it three layers up — is a habit worth breaking. It lets callers write code without ever asking "can this fail?"

## What is a Result type and when should I use one?

Short answer: `Result<T, E>` (Rust) or a multi-value return (Go's `(value, error)` pattern) encodes success-or-failure directly in the type system, so the compiler stops you from moving on without handling the failure branch. TypeScript can approximate this with a custom `Result<T, E>` union or a small library like neverthrow.

Rust's `?` operator automatically propagates the error branch of a `Result`-returning expression, collapsing "return early on error" to a single character. Go does the same work by hand with `if err != nil { return err }` — tedious, but every failure point stays visible, making a swallowed error much harder for a reviewer to miss.

```go
type ValidationError struct {
	Field string
	Msg   string
}

func (e *ValidationError) Error() string {
	return fmt.Sprintf("%s: %s", e.Field, e.Msg)
}

func ParseAge(input string) (int, error) {
	age, err := strconv.Atoi(input)
	if err != nil {
		return 0, &ValidationError{Field: "age", Msg: "must be a number"}
	}
	if age < 0 || age > 150 {
		return 0, &ValidationError{Field: "age", Msg: "out of a sane range"}
	}
	return age, nil
}
```

The payoff: callers can branch on the failure kind with `errors.As` (Go) or pattern matching (Rust) — return 400 on a validation error, retry on a transient database error.

## Where should I catch an error versus propagate it?

Short answer: catch an error at the first layer where you can make a meaningful decision about it — retry, fall back, degrade gracefully — otherwise wrap it with context and keep propagating upward. Catching an error mid-stack "just in case" and swallowing it only hides where the failure came from.

| Layer | Catch or propagate? | Why |
|---|---|---|
| Repository / data access | Propagate (wrap with context) | Can't decide what a connection error means for the end user |
| Service / business logic | Catch, translate by type | Right place to turn "out of stock" into a domain error |
| HTTP handler / API boundary | Catch, map to HTTP status | Last stop before the response — translate, never swallow |
| Retry/timeout wrapper | Catch, retry conditionally | Only decides whether this boundary is retry-safe |
| Outermost background worker loop | Catch, log, continue | One message's failure shouldn't take down the whole queue |

## How do I wrap errors with context instead of swallowing them?

Short answer: when propagating an error upward, preserve the original error while adding what operation was attempted and with what input; never swallow it with an empty catch block. Go's `fmt.Errorf("updating user %d: %w", userID, err)` keeps the original accessible via `%w`, so callers can still inspect it with `errors.Is` or `errors.As`.

A silently swallowed error is what an SRE dreads most: the system looks healthy while it quietly produces bad data. One costly incident I've seen came from a payment webhook handler that caught a signature-verification failure, `console.log`'d it, and returned 200 anyway — nobody noticed for three weeks because nothing ever alerted.

## How should user-facing error messages differ from internal logs?

Short answer: the message a user sees should be short, actionable, and free of internal detail ("Your card was declined, contact your bank"), while the logged error should carry the stack trace, request context, and exact underlying cause. Generating both from the same string usually weakens each one.

In practice, an error object carries two fields: a `userMessage` safe to render directly, and an `internalMessage` that only reaches logs and APM. A database schema name or raw stack trace leaking into the UI is a bug, not a cosmetic issue.

## What is a correlation ID and why do I need one?

Short answer: a correlation ID (often called a trace ID) is a unique identifier that stays the same as a request moves through every service it touches; attaching it to every log line turns "which user request caused this error" into a one-query answer instead of an afternoon of grepping. As of August 2026, the industry standard is the W3C Trace Context specification, which carries the trace ID across services through the `traceparent` and `tracestate` HTTP headers.

OpenTelemetry adopted W3C Trace Context as its default propagation format, so two services instrumented with OTel share the same trace ID without a custom agreement. Pair that with structured logging — a fixed-schema format like JSON instead of free text — and a distributed failure can be reassembled with one search query on `trace_id`. Forwarding the incoming `traceparent` header beats inventing your own ID format.

## Where do retries and timeouts fit into error handling?

Short answer: retries and timeouts aren't part of error handling itself — they're its *boundary*. Wherever you catch an error, ask "is this transient or permanent," and apply a retry only at that layer; the full backoff strategy and circuit-breaker mechanics are covered in [Retries, Backoff, and Circuit Breakers](/en/posts/retries-backoff-circuit-breakers). Retry at the layer that knows *why* the call failed, not in one generic "retry everything three times" wrapper at the outer edge.

## Should errors fail loudly in development but gracefully in production?

Short answer: yes — in development an error should surface immediately and loudly (full stack trace, exact message, even a crashed process) because the goal is catching it early; in production the same failure should reach the user as a graceful message while reaching the system as a full-detail log, metric, and alert. Per the Google SRE book's approach to reliability, "silently continue" is rarely the right default even in production.

The clean way to do this: an environment-aware presentation layer, where a middleware returns the full stack trace in development and a generic message in production from the same error object.

## Error-handling checklist

- Does each error type carry enough information for the caller to decide what to do?
- When wrapping, do you preserve the original error (`%w`, `source()`, `cause`)?
- Are the user-facing message and the logged message separate fields?
- Does every log line carry a correlation/trace ID?
- Does the retry boundary sit at the layer that knows whether the failure is transient?
- Does the process shut down gracefully after a panic or crash?

## Anti-patterns to avoid

- **Empty catch blocks**: `catch (e) {}` doesn't undo the failure, it just makes it invisible.
- **Throwing a generic `Exception`**: leaves the caller unable to branch on failure type.
- **Comparing error messages as strings**: `if err.Error() == "not found"` breaks silently when the text changes.
- **Retrying everything**: blindly retrying a non-idempotent operation (a payment, an email send) can duplicate side effects.
- **Leaking stack traces to users**: a security risk and bad UX at once.
- **Forgetting to log the correlation ID**: in a distributed system, that's functionally the same as never finding the error.

## Frequently Asked Questions

### Can I use Result types and exceptions in the same codebase?

Yes, most large systems mix both: typed errors or `Result` for expected business failures, exceptions for programmer errors and truly unrecoverable states. What matters is drawing the line explicitly as a team convention.

### Is a correlation ID the same thing as a request ID?

Not quite: a request ID usually identifies one request within a single service, while a correlation ID (trace ID) is the umbrella identifier spanning every downstream call that request triggers. W3C Trace Context represents these separately as the trace ID and span ID fields inside `traceparent`.

### What fields should every log line include for error tracing?

At minimum: a timestamp, log level, `trace_id`, the service or function where the error occurred, and the original error message; structured logging (JSON) makes these fields filterable instead of buried in free text. Never log sensitive data — passwords, tokens, personal identifiers — inside an error message.

---

Related reading: [Retries, Backoff, and Circuit Breakers](/en/posts/retries-backoff-circuit-breakers), [Observability 101: Logs, Metrics, and Traces](/en/posts/observability-logs-metrics-traces), [Getting Started with OpenTelemetry](/en/posts/getting-started-with-opentelemetry), [Idempotent APIs: Safe Retries by Design](/en/posts/idempotent-api-design), [Clean Code Principles: A Practical Checklist](/en/posts/clean-code-principles-checklist).

Sources: [W3C Trace Context](https://www.w3.org/TR/trace-context/), [OpenTelemetry Context Propagation](https://opentelemetry.io/docs/concepts/context-propagation/), [Working with Errors in Go 1.13](https://go.dev/blog/go1.13-errors), [The Rust Programming Language — Error Handling](https://doc.rust-lang.org/book/ch09-00-error-handling.html).
