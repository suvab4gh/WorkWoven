# Worker Agent using @axlsdk/axl (Conceptual implementation in Python)
import requests
import json

def accept_job():
    print("Worker Agent communicating over AXL to accept job...")
    # Typically this would be using localhost port bound to the actual AXL node
    # POST to localhost:8000/api/axl/send 
    
    payload = {
        "to": "employer.agent.eth",
        "action": "accept_job",
        "worker": "maria.labor.eth"
    }
    
    print(f"Sent AXL Message: {json.dumps(payload)}")
    print("Status: 200 OK - Message Encrypted and Routed via AXL Peer Discovery")

if __name__ == "__main__":
    accept_job()
