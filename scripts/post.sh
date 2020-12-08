#!/bin/bash
datetime=$(date +%s)
curl -X POST -H "Content-Type: application/json" -H "X-Temppost-Password: test" -d "{\"datetime\":${datetime}000,\"temperature\": 22.0041086409, \"humidity\": 49.1351015079, \"pressure\": 1022.50175382}" localhost:3000/api/temperature