# Build stage
FROM golang as builder

WORKDIR /app

COPY fullcyclerocks.go .

RUN go build fullcyclerocks.go

# Optimized stage
FROM scratch

WORKDIR /app

COPY --from=builder /app .

CMD ["/app/fullcyclerocks"]