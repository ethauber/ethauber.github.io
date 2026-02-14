Your AI's interface to the world.
{: .tagline-subtle}

## Definition
Model Context Protocol, or MCP, is an open standard for a large language model driven application to call tools and read resources through a consistent interface.

## Background
Modern AI systems like large language models (LLMs) applications are powerful but do not natively interact with the real world in a standardized way. Out of the box an LLM's knowledge is frozen in time and cannot perform real actions on its own like checking today's weather, querying a database, or booking a meeting.

The Model Context Protocol (MCP) introduced by Anthropic in late 2024 allows an LLM to do real actions. MCP is an open standard "language" for LLMs to communicate with external data, tools, and services. MCP is like the USB-C port for AI applications acting as a uniform interface that allows LLM running systems to connect with anything from databases to web browsers in a standard way.

## Why does MCP matter?
By providing a protocol for standardizing LLM application integrations, MCP solves the "NxM integration problem".

When N amount of AI models require a customer connector for M amount of data sources the development overhead and need for scalable interoperable AI ecosystems increases.

So it empowers LLMs to access real-time data, execute actions securely, and maintain context across tools in a way that does not require nearly as much overhead and creates an interoperable system by default in a much more scalable way.

For software developers, this means that building once with this standard and for end consumers it results in personalized assistants that interact seamlessly with calendars, databases, etc.

Adoption is rapid for MCP. Early integrators include Block, Apollo, Replit, Zed, Codeium, and Sourcegraph. Then major providers like OpenAI (ChatGPT) and Google DeepMind (Gemini) added support in early 2025.

## What Exactly is MCP?
MCP is a client-server protocol much like an API but tailored specifically for AI model needs. An MCP server is ran to expose some functionality (tool) or data and then an MCP client connects to this server. Usually the MCP client is inside an AI application or agent. The application or agent via the MCP client can then ask the server for information or invoke the tools it provides. Everything is communicated with JSON messages in the JSON-RPC 2.0 format. The design was inspired by the Language Server Protocol (LSP) from developer tooling so the MCP messages follow a request/response pattern.

There is supposrt for multiple transport layers. The local connections for running an AI and tool on the same machine MCP can use standard in out streams STDIO for speed and simplicity. For remote or network connections that typically uses HTTP with Server-Sent Events (SSE) to stream the responses in real-time. Streamin gis important because the AI tasks usually involve iterative and/or long-running processes. SSE allos ther server to send back a flow of updates like the tokens generated for the answer to a query, progress notifications, etc. This can also be done by polling, which has its own trade offs.

MCP servers are the providers in the ecosystem as they expose different endpoints to an MCP client consumer.
The different kinds are resources, tools, and prompts. The prompts are predefined interaction patterns or templates for the AI. It is a more advanced feature for the server to offere canned conversationsl routines or multi-step workflows that the AI can call. The tools are functions that the client can invoke to perform operations or side effects, which in a way is similar to POST endpoints in RESTful APIs. Examples are like sending an email, running a calculation, possibly controlling a robot in the near future, etc. Resources are read-only data access similar to GET endpoints in RESTful APIs that are typically used for providing context or knowledge to the model.

MCP formalizes what many ad-hoc solutions tried to do with function calling or plugins, but in a tool-agnosticway. Instead of each AI vendor inventing their own plugin system, MCP provides a unified, open standard. For dvelopers, this signiciantly cuts down on integration complexity. We build a tool interface once as an MCP server and it cna work with any AI agent that "speaks" MCP. For AI applications or agents, MCP unlocks an ecosystem of capabilities that would otherwise be off-limits, making them more useful and context-aware for end users. Adn for end users, it mean AI assistants that can actually access up-to-date information and perform tasks on request, rather than hitting a dead end at the limits of their training data.

To illustrate, Cloudflare's team provides a great analogy: Imagine your AI assistant needs to make a restaurant reservation. Normally, it has no "phone" to call the restaurant but an MCP server could act like the phone line. The AI finds a "restaurant_reservation" tool from the MCP server and uses it to ask about availability to book a table. In this way, MCP is like giving the AI a phone number to get things done in the external world. It is the bridge between AI and everything else. Calendar, database, web service, or even AI agents are now communicable with this protocol.

## Quickstart Leveraging python's FastMCP (MCP Server)
Now let us actually solidify this with a practical example. We will set up a simple MCP server in Python using the FastMCP library to demonstrate the interactions with the protcol. FastMCP is the official Python framework (originally developed by Prefect) for building MCP servers and clients. It abstracts away the low-level-protocol handling so we can register Python functions as tools with minimal boilerplate.

### Environment and Installation
First, make sure ptyhon 3.8 or newer is available. It is recommended to use a virtual environment for cleanliness. Then install fastmcp and a couple of helper libraries for HTTP and SSE interactions.
python3 -m venv venv
source venv/bin/activate
pip install fastmcp httpx uvicorn httpx-sse
FastMCP is the core library for MCP in python. HTTPX is the popular async http client and httpx-sse is an extension to help with server-sent events streaming. The uvicorn package is an ASGI web server. FastMCP will use it under the hood to run an HTTP server when we launch our MCP server.

### Next the file for the server. The following is a minimal example that exposes one tool.
<hr>
```python
from fast mcp import FastMCP

mcp = FastMCP('DemoMCP-Server')

@mcp.tool
def add(a, b):
  """Add two numbers and return the result."""
  return a + b

if __name__ == '__main__':
  mcp.run(transport='http', port 8000)
```
<hr>
### Calling the MCP Server (MCP Client)
Now the client will call the new add tool. In a real scenario some custom AI agent or AI application would use an MCP client library. Instead head we will use HTTPX to send a raw request to show it is not magic but a simple network request. MCP is just JSON-RPC over HTTP.

The MCP HTTP endpoint expects JSON-RPC 2.0 messages. For a tool call, that means sending a JSON payload that includes a method like 'call_tool' with a name and arguments. As well as an ID for the RPC call.

The code is.
<hr>
```python
import htpx
endpoint = 'http://localhost:8000/mcp'
request_payload = {
  "jsonrpc": "2.0",
  "id": 1,
  "method": "call_tool",
  "params": {
    "name": "add",
    "arguments": {"a": 4, "b": 2}
  }
}
response = https.post(endpoint, json=request_payload, timeout=5.0)
result = response.json()
print(f'The raw response is {result}')
```
<hr>

That example is simple but there are scenarios where the tool might take time to continuously output like an AI streaming token by token. In MCP's HTTP transport the responses can be sent as Server-Sent Events. If we had a tool that instead yielded partial results the server instead will keep the HTTP connecvtion open and send a stream of events. This is where the helper plugin library is useful.

<hr>
```python
from httpx_sse import connect_sse

with httpx.Client() as client:
  with connect_sse(client, 'GET', endpoint) as event_source:
    for event in event_source.iter_sse():
      print(f'Received event {event.data}')
```
<hr>
This is an oversimplification since the client might initiate a call that then triggers the SSE. Regardless the idea is that iter_sse() allows iteration of the messages as they arrive allowing real-time updates.
Error Handling, Auth, etc.

Our quickstart server is minimal and sutiable for a local demo but in real applications things like authentication, permission check, and error handling. MCP suports these concerns. FastMCP 2.0 includes integration with OAuth providers like GOogle GitHub, and others. Also, resource endpoints can be defined.

## Use Case 1: Agentic Systems and Multi-Agent Workflows
