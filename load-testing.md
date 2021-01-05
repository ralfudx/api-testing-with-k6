Load Testing Result 

`BASE_URL=https://api.loadtest.ue2.breadgateway.net`

# 1 Instance, 4500 Concurrent users, 15 mins 
Dashboard - [link](https://app.datadoghq.com/apm/service/application/net.http.server?end=1601994360000&env=loadtest&paused=true&start=1601993460000)

|Name | Total Requests   | RPS at Peak  | Requests/s  | p50 Latency   | Max Latency  | p99 Latency  |
|---|---|---|---|---|---|---|
| Application Start   | 58.0K   | 118 req/s  | 64.5 req/s  | 17.1s  | 49.7s  | 49.77s  |
| Application Checkout  | 23.1k  | 36 req/s  |   25.7 req/s | 19.8s  |51.9s   | 39.9s  |

- No errors 
- Peak at `118 req/s for application start` and `36 req/s for checkout`

# 2 Instance, 4500 Concurrent users each instance, 15 mins 
Dashboard - [link](https://app.datadoghq.com/apm/service/application/net.http.server?end=1601996160000&env=loadtest&paused=true&start=1601995260000)

|Name | Total Requests   | RPS at Peak  | Requests/s  | p50 Latency   | Max Latency  | p99 Latency  |
|---|---|---|---|---|---|---|
| Application Start   | 51.1K   |  98 req/s | 56.8 req/s  |  32.9s | 105s  | 105s  |
| Application Checkout  | 18.8K  | 38 req/s  | 20.9 req/s   | 36.4s  | 110s  | 110s  |

- Few errors 
- p50 latency almost doubled for application start / checkout
- Adding one more instance didn't increase the number of requests hitting the server because of very high latency

# 3 Instance, 4500 Concurrent users each instance, 15 mins 
Dashboard - [link](https://app.datadoghq.com/apm/service/application/net.http.server?end=1601997720000&env=loadtest&paused=true&start=1601996760000)

|Name | Total Requests   | RPS at Peak  | Requests/s  | p50 Latency   | Max Latency  | p99 Latency  |
|---|---|---|---|---|---|---|
| Application Start   | 45.8K   | 113 req/s  | 47.7 req/s  | 25.2s  | 154s  | 154s  |
| Application Checkout  | 17.3K  |  70 req/s | 18.0 req/s   | 29.5s  | 160s  | 160s  |

- Lots of error, and we can safely say some are initiated by client. Needs more investigation on this
- p99 latency is quite high 
- peak for application checkout is 70 req/s
- Adding more instance didn't increase the overall requests/second

# 4 Instance, 4500 Concurrent users each instance, 15 mins 
Dashboard - [link](https://app.datadoghq.com/apm/service/application/net.http.server?end=1602000120000&env=loadtest&paused=true&start=1601999220000)

|Name | Total Requests   | RPS at Peak  | Requests/s  | p50 Latency   | Max Latency  | p99 Latency  |
|---|---|---|---|---|---|---|
| Application Start   | 40.8K   | 60 req/s  | 45.3 req/s  | 15.2s  | 171s  |  171s |
| Application Checkout  | 16.9K   |  64 req/s  | 18.8 req/s   | 18.0s  | 154s  | 154s  |

- Too many errors ( requires some investigation)
- P99 latency is very high 