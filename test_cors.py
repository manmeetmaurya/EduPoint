#!/usr/bin/env python3
import urllib.request
import json
import sys

# Test sendotp endpoint with CORS origin header
url = "http://localhost:4000/api/v1/auth/sendotp"
headers = {
    "Content-Type": "application/json",
    "Origin": "https://edu-point-chi.vercel.app"
}

payload = json.dumps({"email": "testcors@example.com"}).encode("utf-8")

req = urllib.request.Request(url, data=payload, headers=headers, method="POST")

try:
    with urllib.request.urlopen(req, timeout=5) as response:
        print(f"Status: {response.status}")
        cors_header = response.headers.get("Access-Control-Allow-Origin")
        print(f"Access-Control-Allow-Origin: {cors_header}")
        body = response.read().decode("utf-8")
        print(f"Response: {body}")
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
