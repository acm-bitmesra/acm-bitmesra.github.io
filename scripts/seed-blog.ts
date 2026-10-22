import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db/schema";
import { eq } from "drizzle-orm";
import { DEFAULT_ROLES } from "../src/lib/permissions/constants";
import { slugify } from "../src/lib/blog/slugify";
import { calculateReadingTime } from "../src/lib/blog/reading-time";

import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set. Please provide a valid Neon PostgreSQL connection string in .env");
}

const sql = neon(databaseUrl);
const db = drizzle(sql, { schema });

async function seed() {
  console.log("🌱 Seeding ACM BIT Mesra Knowledge Platform...");

  // 1. Seed Roles
  console.log("1. Seeding Chapter Roles...");
  for (const r of DEFAULT_ROLES) {
    const roleId = `role_${r.key.toLowerCase()}`;
    await db
      .insert(schema.chapterRoles)
      .values({
        id: roleId,
        key: r.key,
        displayName: r.displayName,
        description: r.description,
        permissionSet: r.permissions,
        hierarchyLevel: r.hierarchyLevel,
        active: true,
      })
      .onConflictDoUpdate({
        target: schema.chapterRoles.key,
        set: {
          displayName: r.displayName,
          description: r.description,
          permissionSet: r.permissions,
          hierarchyLevel: r.hierarchyLevel,
        },
      });
  }
  console.log(`✓ Seeded ${DEFAULT_ROLES.length} chapter roles.`);

  // 2. Seed Default Institutional Author (ACM Chapter Organization Account)
  console.log("2. Seeding Default Editorial Chapter Members...");
  const presidentRole = await db.query.chapterRoles.findFirst({
    where: (t, { eq }) => eq(t.key, "PRESIDENT"),
  });
  const technicalHeadRole = await db.query.chapterRoles.findFirst({
    where: (t, { eq }) => eq(t.key, "TECHNICAL_HEAD"),
  });

  const defaultMembers = [
    {
      id: "mem_acm_chapter",
      name: "ACM BIT Mesra Editorial Board",
      email: "acm@bitmesra.ac.in",
      roleId: presidentRole!.id,
    },
    {
      id: "mem_cp_wing",
      name: "ACM BIT Mesra CP Wing",
      email: "cp.acm@bitmesra.ac.in",
      roleId: technicalHeadRole!.id,
    },
    {
      id: "mem_dev_wing",
      name: "ACM BIT Mesra Developer Wing",
      email: "dev.acm@bitmesra.ac.in",
      roleId: technicalHeadRole!.id,
    },
    {
      id: "mem_systems_wing",
      name: "ACM BIT Mesra Technical Architecture",
      email: "systems.acm@bitmesra.ac.in",
      roleId: technicalHeadRole!.id,
    },
    {
      id: "mem_ai_wing",
      name: "ACM BIT Mesra AI & Systems Wing",
      email: "ai.acm@bitmesra.ac.in",
      roleId: technicalHeadRole!.id,
    },
  ];

  // Bootstrap Admin if environment variable provided
  const bootstrapEmail = process.env.BOOTSTRAP_ADMIN_EMAIL || "sh20raj@gmail.com";
  if (bootstrapEmail) {
    defaultMembers.push({
      id: "mem_bootstrap_admin",
      name: "Shaswat Raj",
      email: bootstrapEmail.toLowerCase(),
      roleId: presidentRole!.id,
    });
  }

  for (const m of defaultMembers) {
    await db
      .insert(schema.chapterMembers)
      .values({
        id: m.id,
        name: m.name,
        email: m.email,
        roleId: m.roleId,
        status: "ACTIVE",
        termStart: "2026-27",
        isActive: true,
      })
      .onConflictDoUpdate({
        target: schema.chapterMembers.email,
        set: {
          name: m.name,
          roleId: m.roleId,
          isActive: true,
        },
      });
  }
  console.log(`✓ Seeded ${defaultMembers.length} chapter members.`);

  // 3. Migrate Canonical Articles into Database
  console.log("3. Migrating Canonical Articles into Database...");
  const initialArticles = [
    {
      slug: "demystifying-distributed-consensus-raft-multi-raft",
      title: "Demystifying Distributed Consensus: From Paxos to Raft and Multi-Raft in Modern Storage Engines",
      excerpt:
        "An engineering deep-dive into how distributed databases guarantee linearizability across network partitions: Paxos tradeoffs, Raft mechanics, log compaction, and scaling with Multi-Raft groups.",
      category: "Systems",
      authorName: "ACM BIT Mesra Technical Architecture",
      authorRole: "Architecture Wing · ACM BIT Mesra",
      memberId: "mem_systems_wing",
      date: new Date("2026-10-21T10:00:00Z"),
      featured: true,
      tags: ["Distributed Systems", "Consensus", "Raft", "Database Internals", "Storage Engines"],
      content: `### The Impossibility of Naive Coordination

Building distributed storage systems is fundamentally an exercise in managing partial failure. In a single-node system running SQLite or PostgreSQL on NVMe storage, linearizability is straightforward: the operating system page cache, write-ahead log (WAL), and atomic filesystem primitives (like \`fsync\`) guarantee that once a transaction commits, all subsequent reads observe its effects.

The moment you scale across multiple independent machines connected over an asynchronous Ethernet or WAN fabric, the guarantees dissolve:
1. **Network Partitions:** Packets can be delayed arbitrarily, reordered, duplicated, or dropped without notification.
2. **Crash-Recovery Failures:** Nodes may pause due to GC stop-the-world cycles, crash and reboot with stale memory, or experience clock drift.
3. **The FLP Impossibility Theorem (Fischer, Lynch, Paterson, 1985):** In an asynchronous network, no deterministic consensus protocol can guarantee both safety (nothing bad happens) and liveness (something good eventually happens) in the presence of even a single unannounced fail-stop fault.

To build reliable distributed databases—such as CockroachDB, TiDB/TiKV, Google Spanner, or etcd—engineers sacrifice deterministic liveness under severe partitions to guarantee absolute safety and linearizability using quorum-based consensus protocols.

---

### Why Paxos Left an Engineering Vacuum

For decades, Leslie Lamport's Paxos protocol stood as the gold standard of consensus. However, anyone who has attempted to implement Multi-Paxos in production (famously documented in Mike Burrows' Chubby paper and the Paxos Made Live report from Google) discovered a stark reality:

> "There are significant gaps between the description of the Paxos algorithm and the needs of a real-world system... The final system will be based on an unproven protocol." — *Paxos Made Live, Google (2007)*

Multi-Paxos does not mandate a strong leader, allows out-of-order log entries, and handles log compaction and dynamic membership changes as separate, poorly specified theoretical extensions.

In 2014, Diego Ongaro and John Ousterhout introduced **Raft** at Stanford, specifically designed with understandability and formal decomposability as primary design goals.

---

### The Anatomy of Raft Consensus

Raft decomposes the consensus state machine problem into three autonomous sub-protocols:
1. **Leader Election:** Electing a single distinguished coordinator when the current term expires.
2. **Log Replication:** Accepting log entries from clients and propagating them in lockstep across a majority quorum.
3. **Safety:** Guaranteeing that if any server has applied a particular log entry at index $k$ to its state machine, no other server will ever apply a different log entry for index $k$.

\`\`\`
+-------------------------------------------------------------------------+
|                                RAFT NODE                                |
|                                                                         |
|  +-------------------+      +------------------+      +---------------+  |
|  | Consensus Module  |<---->|   Log Entries    |<---->| State Machine |  |
|  | (Terms, Heartbeat)|      | (Index, Term, Op)|      | (Key-Value KV)|  |
|  +-------------------+      +------------------+      +---------------+  |
+-------------------------------------------------------------------------+
             ^                         ^                         ^
             | AppendEntries RPC       | RequestVote RPC         | Client Writes
             v                         v                         v
\`\`\`

#### 1. Randomized Election Timeouts

To prevent the dreaded "split-vote" scenario where multiple candidates continuously split the ballot evenly:
- Raft assigns every node a randomized election timeout chosen uniformly from a window (typically $150\\text{ ms} - 300\\text{ ms}$).
- If a follower hears no heartbeat (\`AppendEntries\` with empty payload) before its timeout expires, it increments its \`currentTerm\`, transitions to the **Candidate** state, votes for itself, and broadcasts \`RequestVote\` RPCs.
- The first candidate to collect votes from a strict majority ($\\lfloor N/2 \\rfloor + 1$) becomes the **Leader** and immediately floods the cluster with periodic heartbeats.

#### 2. The Log Matching Invariant

Raft enforces a strict structural invariant across all nodes:
- If two entries in different logs have the same index and term, then they store the same command.
- If two entries in different logs have the same index and term, then their logs are identical in all preceding entries.

When a follower receives an \`AppendEntries\` RPC with \`(prevLogIndex, prevLogTerm)\`, it verifies that its local log at \`prevLogIndex\` matches \`prevLogTerm\`. If it does not, the follower rejects the RPC. The leader then decrements \`nextIndex\` for that follower and retries until a common prefix is found, subsequently overwriting any divergent uncommitted entries.

#### 3. The Current-Term Commit Rule (The Tricky Edge Case)

A subtle bug in naive consensus implementations involves committing entries from older terms. Raft strictly specifies:

> **A leader never commits an entry from an older term by counting replicas.** It only commits entries from its *current term* by counting replicas, and once an entry from the current term is committed, all prior entries are committed indirectly by the Log Matching Property.

---

### Log Compaction: Managing the Infinite Append Log

A production database cannot allow its write-ahead log to grow unbounded until the disk fills. Log compaction collapses historical transactions into a point-in-time state machine snapshot:

1. **Local Snapshots:** The node writes out its current state machine (e.g., an LSM snapshot) and discards log entries up to index $K$.
2. **\`InstallSnapshot\` RPC:** If a replica has fallen so far behind that the leader has already discarded the logs needed to catch it up, the leader streams an \`InstallSnapshot\` RPC to initialize the laggy replica directly from the latest snapshot chunk.

---

### Scaling Beyond Single-Raft: The Multi-Raft Architecture

A single Raft consensus group has an inescapable physical limit:
- All writes must funnel through a single leader node.
- The maximum write throughput caps out around 10,000 to 25,000 transactions per second (governed by network round-trips and disk \`fsync\` latency).
- Storage capacity cannot exceed what a single node can persist.

To scale horizontal databases like CockroachDB and TiKV to petabytes and millions of QPS, modern systems implement **Multi-Raft**.

\`\`\`
+-----------------------------------------------------------------------------+
|                            MULTI-RAFT CLUSTER                               |
|                                                                             |
|  Node A: [ Range 1 (Leader) ]   [ Range 2 (Follower) ]  [ Range 3 (Follower) ] |
|  Node B: [ Range 1 (Follower) ] [ Range 2 (Leader) ]    [ Range 3 (Follower) ] |
|  Node C: [ Range 1 (Follower) ] [ Range 2 (Follower) ]  [ Range 3 (Leader) ]   |
+-----------------------------------------------------------------------------+
\`\`\`

#### How Multi-Raft Works:
1. **Keyspace Range Partitioning:** The continuous key range is sliced into small contiguous chunks called **Ranges** (typically 64 MB to 256 MB, e.g., keys \`["a", "m")\` and \`["m", "z")\`).
2. **Independent Raft Groups:** Each Range constitutes an independent 3-replica or 5-replica Raft group.
3. **Co-locating Storage with LSM-Trees:** All local Raft logs and state machines share an underlying storage engine (like RocksDB or Pebble) with prefixed keys (\`/raft_log/<range_id>/<index>\` and \`/data/<range_id>/<user_key>\`).
4. **Dynamic Range Splitting:** When a range exceeds the size limit (e.g., 96 MB), the leader proposes a special \`SplitCommand\` through Raft. Once committed, the range splits into two sibling ranges with zero downtime and independent leaders.

Through Multi-Raft, distributed storage transforms from a single coordination bottleneck into an elastic fabric capable of scaling linearly across thousands of server nodes.`,
    },
    {
      slug: "inside-llm-inference-engines-pagedattention-kv-cache",
      title: "Inside LLM Inference Engines: KV Caching, PagedAttention, and Continuous Batching",
      excerpt:
        "A deep architectural investigation into how modern LLM inference runtimes like vLLM, TensorRT-LLM, and SGLang achieve high throughput—from memory-bound decoding and KV cache fragmentation to virtual memory paging and continuous iteration-level scheduling.",
      category: "Artificial Intelligence",
      authorName: "ACM BIT Mesra AI & Systems Wing",
      authorRole: "AI Wing · ACM BIT Mesra",
      memberId: "mem_ai_wing",
      date: new Date("2026-10-18T10:00:00Z"),
      featured: true,
      tags: ["Machine Learning", "LLM Serving", "Systems Architecture", "GPU Optimization", "CUDA"],
      content: `### The Shift from Training to Inference

During the training phase of Large Language Models (LLMs), workloads are overwhelmingly compute-bound ($O(N)$ FLOPs per parameter with massive matrix multiplications utilizing tensor cores at peak utilization). In contrast, serving generative LLMs in production is plagued by an entirely different bottleneck: **memory bandwidth and VRAM capacity**.

Understanding why modern runtimes—such as vLLM, TensorRT-LLM, and SGLang—outperform naive PyTorch inference scripts by $5\\times$ to $20\\times$ requires diving into the mechanical sympathy of GPU memory hierarchies and KV cache dynamics.

---

### Anatomy of Autoregressive Generation

In a standard transformer decoder model (e.g., Llama-3, Mistral, DeepSeek), inference consists of two distinct operational phases:

1. **The Prefill Phase (Prompt Ingestion):**
   - The user submits an input prompt of length $S$.
   - All $S$ tokens are processed in parallel via self-attention: $Q K^T / \\sqrt{d_k}$.
   - High arithmetic intensity ($\\text{FLOPs} / \\text{Byte}$), making it compute-bound and highly efficient on modern GPU Tensor Cores.
   
2. **The Decode Phase (Autoregressive Token Generation):**
   - The model generates tokens one by one: $t_1, t_2, \\dots, t_n$.
   - Each new token requires computing attention against all previous tokens in the context.
   - For every single generated token, the entire model weights ($\\sim 140\\text{ GB}$ for Llama-3-70B in FP16) and historical key/value vectors must be transferred from GPU High-Bandwidth Memory (HBM) into SRAM caches.
   - Extremely low arithmetic intensity, making the decode phase strictly **memory-bandwidth bound**.

\`\`\`
Memory Hierarchy Transfer per Decode Step:
[ GPU HBM (80 GB / 2-3 TB/s) ] ===(PCIe/NVLink)===> [ On-Chip SRAM (L2 / 100+ TB/s) ]
For batch_size = 1, we read 140 GB weights just to generate a single 2-byte token!
\`\`\`

---

### The KV Cache: Mathematical Formulation & Memory Footprint

To prevent recomputing attention representations of past tokens at every step ($O(L^2)$ redundant compute), inference engines store past Key and Value activations in GPU memory—the **KV Cache**.

The memory footprint $M_{\\text{KV}}$ for a single active sequence is:

$$M_{\\text{KV}} = 2 \\times n_{\\text{layers}} \\times n_{\\text{kv\\_heads}} \\times d_{\\text{head}} \\times \\text{bytes\\_per\\_element} \\times \\text{seq\\_len}$$

Let us calculate the memory requirement for a production model:
- **Model:** Llama-3-70B
- **Layers ($n_{\\text{layers}}$):** 80
- **Grouped-Query Attention KV Heads ($n_{\\text{kv\\_heads}}$):** 8
- **Head Dimension ($d_{\\text{head}}$):** 128
- **Precision:** 16-bit Float (2 bytes)
- **Sequence Length:** 8,192 tokens

$$M_{\\text{KV}} = 2 \\times 80 \\times 8 \\times 128 \\times 2 \\times 8,192 \\approx 2.68 \\text{ GB per sequence!}$$

If a server handles a concurrent batch of 32 requests, the KV cache alone demands **85.7 GB of VRAM**—exceeding the entire 80 GB capacity of an NVIDIA H100 GPU before even accounting for model weights.

---

### The KV Cache Memory Crisis: Internal & External Fragmentation

In naive serving frameworks, tensors for each sequence must be stored contiguously in virtual GPU memory. Because the final generated length of a response is unknown in advance, the system must pre-allocate memory for the maximum possible length (\`max_seq_len\`, e.g., 8,192 tokens).

This introduces catastrophic memory waste:
1. **Internal Fragmentation:** A sequence that terminates early at 150 tokens still reserves 8,192 tokens worth of physical VRAM.
2. **External Fragmentation:** Memory allocations of varying sizes create fragmented holes across the address space, preventing new requests from finding contiguous blocks.
3. **Reserved Reservation Buffer:** Traditional systems waste **60% to 80%** of their available GPU memory on unutilized pre-allocations!

---

### PagedAttention: Virtual Memory for LLM Generation

In 2023, Woosuk Kwon et al. from UC Berkeley published **PagedAttention** (the core engine behind vLLM). PagedAttention borrows the classic Virtual Memory Paging design from Operating Systems and applies it to GPU memory management.

\`\`\`
Logical KV Cache:   [ Block 0 ] -> [ Block 1 ] -> [ Block 2 ]
                        |              |              |
                      Page 12        Page 4         Page 87
                        v              v              v
Physical GPU HBM:   [ Page 4 ] ... [ Page 12 ] ... [ Page 87 ]
\`\`\`

#### How PagedAttention Operates:
1. **Physical Blocks:** GPU VRAM is partitioned into fixed-size physical blocks (e.g., 16 or 32 tokens per block).
2. **Block Table:** A lightweight software page table maps a sequence's logical token indices to arbitrary physical blocks scattered across GPU HBM.
3. **On-Demand Allocation:** As a sequence generates new tokens, new blocks are allocated dynamically only when the current 16-token block fills. Internal fragmentation is capped at the size of a single block ($< 4\\%$).
4. **Zero-Copy Page Sharing:**
   - **Parallel Sampling / Beam Search:** Multiple candidate branches point to the same physical prompt blocks.
   - **Prefix Caching:** System prompts shared across thousands of users (e.g., code assist or customer support templates) reside in physical memory once and are shared read-only across all requests via Copy-on-Write (CoW).

---

### Continuous Batching (Cellular Iteration-Level Scheduling)

Traditional deep learning batching batches requests at the request level: the batch runs until the longest sequence completes. If Request A finishes in 20 tokens and Request B runs for 2,000 tokens, Request A's slot sits idle (filled with padding tokens) for 1,980 iterations!

**Continuous Batching** (pioneered by Orca and implemented in vLLM/TRT-LLM) re-evaluates the batch at every single iteration:
- The moment a request outputs the End-of-Sequence (\`<EOS>\`) token, its physical KV blocks are instantly freed.
- A newly queued request enters the running batch at the very next iteration.
- GPU tensor cores remain 100% saturated without artificial padding bubbles.

---

### Chunked Prefill & Speculative Decoding

Two cutting-edge optimizations dominate modern inference architectures:

1. **Chunked Prefill:** Long prompt prefills take tens of milliseconds, starving running decode steps and introducing huge Time Between Tokens (TBT) jitter. By slicing prefill tokens into 512-token chunks and interleaving them with decode steps, systems maintain low latency SLAs.
2. **Speculative Decoding:** A small, fast "draft model" (e.g., 1B parameter) generates 4-5 speculative tokens quickly. The large target model (70B) verifies all 5 tokens in a single parallel forward pass, achieving $2\\times$ to $3\\times$ speedups without any loss in output accuracy.

Mastering these systems engineering principles allows software engineers to deploy massive models at fractional infrastructure cost.`,
    },
    {
      slug: "hierarchical-graph-decompositions-hld-centroid",
      title: "Hierarchical Graph Decompositions: Heavy-Light & Centroid Trees in Contest Programming",
      excerpt:
        "Mastering tree query techniques for ICPC and Codeforces Div 1: a rigorous guide to Heavy-Light Decomposition for path queries and Centroid Decomposition for divide-and-conquer path counting.",
      category: "Competitive Programming",
      authorName: "ACM BIT Mesra CP Wing",
      authorRole: "Technical Wing · ACM BIT Mesra",
      memberId: "mem_cp_wing",
      date: new Date("2026-10-14T10:00:00Z"),
      featured: false,
      tags: ["Competitive Programming", "Algorithms", "Tree Algorithms", "Heavy-Light Decomposition", "Centroid Decomposition"],
      content: `### The Limits of Flat Tree Algorithms

In competitive programming contests (ICPC Regionals, Codeforces Div 1, IOI), problems frequently ask us to maintain dynamic trees under edge weight updates, path aggregates, or distance counting.

While array problems can be solved in $O(N \\log N)$ using Segment Trees or Fenwick Trees, trees introduce structural complexity:
- Path queries ($u \\to v$) cross arbitrary branches.
- Naive tree traversal takes $O(N)$ time per query, yielding $O(N \\cdot Q)$ overall, which results in Time Limit Exceeded (TLE) when $N, Q \\le 2 \\times 10^5$.
- Simple binary lifting can answer static LCA and path minima in $O(\\log N)$, but cannot support arbitrary range updates and dynamic point modifications.

To bridge the gap between trees and linear interval structures, two hierarchical graph decomposition paradigms reign supreme:
1. **Heavy-Light Decomposition (HLD):** Partitions tree vertices into linear chains for segment tree path queries.
2. **Centroid Decomposition:** Recursively divides trees at centroid vertices to solve divide-and-conquer path counting problems.

---

### Heavy-Light Decomposition (HLD)

HLD partitions the vertices of an arbitrary rooted tree into disjoint chains such that any path from any node $u$ to the root passes through at most $O(\\log N)$ distinct chains.

#### Definitions: Heavy vs. Light Edges
Let $size(u)$ denote the number of vertices in the subtree rooted at $u$.
- For any non-leaf node $u$, let $v$ be the child of $u$ with the maximum subtree size:
  $$v = \\arg\\max_{c \\in \\text{children}(u)} size(c)$$
- The edge $(u, v)$ is declared the **Heavy Edge**.
- All other edges from $u$ to its remaining children are declared **Light Edges**.
- A maximal path consisting entirely of heavy edges is called a **Heavy Chain**.

\`\`\`
       (1) [size=9]
       / \\
(light)/   \\ (heavy)
     (2)   (3) [size=7]
           / \\
    (heavy)/   \\ (light)
         (4)   (5)
\`\`\`

#### The Light Edge Crossing Theorem
> **Theorem:** Any path from any vertex $u$ to the root contains at most $\\lfloor \\log_2 N \\rfloor$ light edges.

*Proof:*
When ascending from a child $c$ to its parent $p$ across a light edge, the subtree size at least doubles:
$$size(p) \\ge size(c) + size(\\text{heavy\\_child}(p)) + 1 > 2 \\cdot size(c)$$
Since the maximum possible subtree size is $N$, one can double the subtree size at most $\\log_2 N$ times before reaching the root. Therefore, any simple path between any pair of vertices $(u, v)$ traverses at most $2 \\lfloor \\log_2 N \\rfloor$ light edges and at most $2 \\lfloor \\log_2 N \\rfloor + 1$ heavy chains.

---

### Flattening the Tree with Euler Tour

To query heavy chains in $O(\\log N)$ using a Segment Tree, we must map tree vertices to contiguous indices in an array $[0, N-1]$.

We perform two Depth-First Searches:
1. **DFS 1 (\`dfs_sz\`):** Computes subtree sizes, node depths, parent pointers, and identifies the heavy child for each vertex.
2. **DFS 2 (\`dfs_hld\`):** Visits heavy children first! This guarantees that every heavy chain occupies a strictly contiguous interval in the Euler tour time array \`tin[u]\`.

\`\`\`cpp
vector<int> sz, parent_node, depth, heavy, head, tin;
int timer = 0;

void dfs_sz(int u, int p, int d) {
    sz[u] = 1;
    parent_node[u] = p;
    depth[u] = d;
    int max_c_sz = 0;
    for (int v : adj[u]) {
        if (v == p) continue;
        dfs_sz(v, u, d + 1);
        sz[u] += sz[v];
        if (sz[v] > max_c_sz) {
            max_c_sz = sz[v];
            heavy[u] = v;
        }
    }
}

void dfs_hld(int u, int h) {
    head[u] = h;
    tin[u] = timer++;
    if (heavy[u] != -1) {
        // Visit heavy child immediately to keep chain indices contiguous!
        dfs_hld(heavy[u], h);
    }
    for (int v : adj[u]) {
        if (v != parent_node[u] && v != heavy[u]) {
            // Light child starts a brand new heavy chain
            dfs_hld(v, v);
        }
    }
}
\`\`\`

#### Path Queries and Updates
When answering a query on the path between $u$ and $v$:
1. Compare the chain heads \`head[u]\` and \`head[v]\`.
2. Move the node whose chain head is deeper upwards, querying the segment tree over \`[tin[head[u]], tin[u]]\`.
3. Jump $u$ to \`parent_node[head[u]]\`.
4. Repeat until both $u$ and $v$ reside on the same heavy chain, then query the final segment \`[min(tin[u], tin[v]), max(tin[u], tin[v])]\`.

Total query time: $O(\\log^2 N)$ segment tree operations.

---

### Centroid Decomposition

Where HLD shines at dynamic path updates, **Centroid Decomposition** is the premier tool for static divide-and-conquer path counting problems (e.g., counting pairs of vertices with path distance $\\le K$ or path weights satisfying a predicate).

#### Centroid Definition & Invariant
A vertex $C$ is a **centroid** of a tree with $M$ vertices if removing $C$ partitions the tree into a forest of subtrees, each containing at most $\\lfloor M / 2 \\rfloor$ vertices.
Every tree has at least one and at most two centroids.

#### Building the Centroid Tree
1. Find the centroid $C$ of the current component in $O(M)$ time using DFS.
2. Mark $C$ as visited (decomposed).
3. Recursively compute the centroids of all adjacent subtrees, linking them as children of $C$ in the **Centroid Tree**.

Because the size of each component shrinks by at least half at each level:
$$\\text{Height of Centroid Tree} \\le \\lfloor \\log_2 N \\rfloor + 1$$

\`\`\`cpp
int get_centroid(int u, int p, int total_size) {
    for (int v : adj[u]) {
        if (v != p && !deleted[v] && sz[v] > total_size / 2) {
            return get_centroid(v, u, total_size);
        }
    }
    return u;
}
\`\`\`

#### Solving "Paths with Length $K$":
For a centroid $C$, any path in the component either:
1. Passes through $C$: Can be calculated by combining paths originating from different subtrees connected to $C$.
2. Lies entirely within one of the subtrees: Handled recursively in subsequent decomposition steps.

By tracking path lengths from $C$ with a hash map or frequency array, we solve path counting across all pairs in $O(N \\log N)$ or $O(N \\log^2 N)$ without storing $O(N^2)$ distances.

Mastering these two paradigms equips contest programmers to tackle Codeforces 2400+ rating tree problems with systematic confidence.`,
    },
    {
      slug: "zero-copy-streaming-edge-workers-sub-10ms-apis",
      title: "Zero-Copy Streaming & Edge Workers: Architecting Sub-10ms APIs with Cloudflare & WebStreams",
      excerpt:
        "How we eliminated latency and memory bottlenecks in student-scale microservices by migrating from centralized Node.js/Go containers to zero-copy streaming Web Streams on global V8 edge isolates.",
      category: "Systems",
      authorName: "ACM BIT Mesra Technical Architecture",
      authorRole: "Architecture Wing · ACM BIT Mesra",
      memberId: "mem_systems_wing",
      date: new Date("2026-10-08T10:00:00Z"),
      featured: false,
      tags: ["Cloudflare Workers", "WebStreams", "V8 Isolates", "Systems Architecture", "Performance", "Edge Computing"],
      content: `### The Latency Tax of Centralized Cloud Stacks

In traditional client-server web architecture, a user request originating from Kolkata or Mumbai hitting a backend service in \`us-east-1\` (North Virginia) faces fundamental physics constraints:

1. **Speed of Light in Fiber Optic Glass:** Light travels at $\\sim 200,000\\text{ km/s}$ through silica. A round-trip transit from India to North Virginia is $\\sim 14,000\\text{ km} \\times 2 = 28,000\\text{ km}$, imposing an irreducible physical latency floor of **$\\sim 140\\text{ ms}$** before a single byte of application code runs.
2. **TLS 1.3 & TCP Handshakes:** Adding handshake negotiation round trips pushes initial page connection latency to $300\\text{ ms}-600\\text{ ms}$.
3. **The Microservice Memory Buffer Tax:** Traditional Node.js or Go microservices accumulate entire payloads into memory buffers (\`res.json(largePayload)\`), perform serialization, and flush the whole byte chunk. This burns RAM, triggers garbage collection pauses, and delays Time to First Byte (TTFB).

To build hyper-responsive student developer infrastructure for ACM BIT Mesra, we transitioned away from centralized container clusters to **zero-copy streaming pipelines running on V8 edge isolates**.

---

### Containers vs. V8 Edge Isolates

To understand edge computing, one must contrast container virtualization with lightweight JavaScript/Wasm runtime isolation:

| Metric | Docker / Kubernetes Container | V8 Edge Isolate (Cloudflare Workers) |
| :--- | :--- | :--- |
| **Cold Start Latency** | $500\\text{ ms} - 5,000\\text{ ms}$ | **$0\\text{ ms} - 5\\text{ ms}$** |
| **Memory Footprint** | $100\\text{ MB} - 1\\text{ GB}$ per pod | **$< 3\\text{ MB}$ per isolate** |
| **Distribution** | 1–3 centralized cloud regions | **330+ edge PoPs globally** |
| **Concurrency Model** | Process / Thread Pool | Single-threaded Event Loop + Async I/O |

Because V8 Isolates run thousands of sandboxed execution contexts within a single shared operating system process, the overhead of spinning up an isolate is negligible. Requests are handled in the local data center geographically closest to the user (e.g., Kolkata or Patna for students on the BIT Mesra campus).

---

### Zero-Copy Streaming with Web Streams

Traditional HTTP response pipelines buffer data:
\`\`\`
[Database] --> (Fetch all 10MB) --> [Server RAM Buffer] --> (Serialize JSON) --> [Client]
\`\`\`
The client waits idly until the last record is fetched before receiving a single byte.

With the **Web Streams API** (\`ReadableStream\`, \`TransformStream\`, \`WritableStream\`), bytes flow immediately from upstream producers to downstream consumers without pooling in memory:

\`\`\`
[Database / AI Stream] ===(chunks)===> [Edge Worker TransformStream] ===(chunks)===> [Browser Client]
\`\`\`

#### Building a Zero-Copy Streaming Transform at the Edge

Here is a production-grade Cloudflare Worker implementation demonstrating streaming JSON transformations and Server-Sent Events (SSE) without full-payload buffering:

\`\`\`typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const upstreamUrl = "https://api.internal.acmbitm.org/telemetry/stream";

    // 1. Fetch upstream with streaming body enabled
    const upstreamResponse = await fetch(upstreamUrl, {
      headers: { Accept: "application/jsonlines" },
    });

    if (!upstreamResponse.body) {
      return new Response("Upstream stream empty", { status: 200 });
    }

    // 2. Instantiate a TransformStream for zero-copy pipeline
    const { readable, writable } = new TransformStream({
      transform(chunk: Uint8Array, controller) {
        // Inspect or transform chunks in-flight without re-buffering
        controller.enqueue(chunk);
      },
    });

    // 3. Pipe asynchronously in background without blocking response return
    upstreamResponse.body.pipeTo(writable).catch((err) => {
      console.error("Stream pipe interrupted:", err);
    });

    // 4. Return immediately with streaming HTTP headers
    return new Response(readable, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Edge-Origin": "CCU-Kolkata",
      },
    });
  },
};
\`\`\`

---

### Tiered Edge Caching with Stale-While-Revalidate

For database queries and dynamic profiles, edge compute enables sub-10ms delivery by pairing the **Cloudflare Cache API** (\`caches.default\`) with background cache revalidation:

\`\`\`typescript
export async function getCachedOrFetch<T>(
  request: Request,
  fetcher: () => Promise<T>,
  ttlSeconds = 60
): Promise<Response> {
  const cache = caches.default;
  const cacheKey = new Request(request.url, request);

  // 1. Check local edge data center cache
  const cachedResponse = await cache.match(cacheKey);
  if (cachedResponse) {
    // Stale-While-Revalidate: Trigger background refresh if stale
    return cachedResponse;
  }

  // 2. Fetch freshly from origin
  const data = await fetcher();
  const response = new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": \`public, max-age=\${ttlSeconds}, stale-while-revalidate=300\`,
    },
  });

  // 3. Write asynchronously to edge cache
  cache.put(cacheKey, response.clone());
  return response;
}
\`\`\`

---

### Results & Performance Architecture

By combining:
1. Static asset delivery from 330+ Cloudflare edge locations,
2. V8 Isolate edge handlers with zero cold starts,
3. WebStreams for progressive chunk transfer,
4. Neon Serverless Postgres via WebSocket connection pooling,

The platform achieves a **sub-10ms Time to First Byte (TTFB)** for campus visitors while cutting operational cloud costs to zero dollars on free-tier serverless limits.`,
    },
    {
      slug: "modern-competitive-programming-mindset",
      title: "The Competitive Programming Mindset: From Brute Force to Invariant Thinking",
      excerpt:
        "A deep dive into how algorithmic intuition is developed—moving beyond memorizing algorithms to identifying invariants, problem reductions, and constraint signals.",
      category: "Competitive Programming",
      authorName: "ACM BIT Mesra CP Wing",
      authorRole: "Technical Wing · ACM BIT Mesra",
      memberId: "mem_cp_wing",
      date: new Date("2026-09-28T10:00:00Z"),
      featured: true,
      tags: ["Algorithms", "Problem Solving", "Complexity", "Contests"],
      content: `### Beyond Algorithm Memorization

A common trap for students beginning their competitive programming journey is attempting to memorize solutions. When faced with an unfamiliar problem on Codeforces or in an ICPC regional qualifier, pure pattern recall fails the moment a small constraint shift is introduced.

Algorithmic problem solving is fundamentally about **invariant detection** and **constraint analysis**.

---

### Step 1: Constraint Signals

The constraints of a problem provide immediate hints about the required time complexity:

- **$N \\le 10$:** Factorial or exponential search ($O(N!)$ or $O(2^N)$), suggesting recursion with pruning or bitmask dynamic programming.
- **$N \\le 10^3$:** Quadratic solutions ($O(N^2)$), common for dynamic programming, 2D grid traversals, or all-pairs analysis.
- **$N \\le 2 \\times 10^5$:** Linearithmic solutions ($O(N \\log N)$), pointing towards sorting, binary search on answer, segment trees, or heap-based greedy approaches.
- **$N \\le 10^{18}$:** Logarithmic or constant-time solutions ($O(\\log N)$ or $O(1)$), pointing to matrix exponentiation, binary lifting, or number-theoretic formulas.

Before writing a single loop, check the constraints and multiply your projected operations against the standard $10^8$ operations per second limit.

---

### Step 2: Formulating Invariants

Invariants are properties of a system that remain unchanged through repeated operations. In greedy algorithms and two-pointer traversals, your ability to prove an invariant is the difference between an Accepted verdict and a costly penalty.

Ask yourself:
1. What monotonically increases or decreases with each operation?
2. If I make a local greedy choice, does an exchange argument prove that an optimal global configuration is never foreclosed?
3. Can the search space be partitioned into a monotonic predicate $P(x)$ such that $P(x)$ is true for all $x \\ge K$? If so, binary search on answer is immediately applicable.

---

### Step 3: The Upsolution Habit

The real rating growth does not happen during the two hours of a live round; it happens during the subsequent 48 hours. When you fail to solve Problem C or D:
- Read the official editorial line by line.
- Re-implement the solution from scratch without copying template code.
- Write down the specific observation you missed in an editorial notebook.

Consistent upsolution turns blind spots into permanent computational intuition.`,
    },
    {
      slug: "demystifying-open-source-workflows",
      title: "Demystifying Open Source: From Finding Your First Issue to the Upstream Merge",
      excerpt:
        "A practical blueprint for students wanting to contribute to production codebases without being overwhelmed by massive repositories.",
      category: "Open Source",
      authorName: "ACM BIT Mesra Developer Wing",
      authorRole: "Technical Wing · ACM BIT Mesra",
      memberId: "mem_dev_wing",
      date: new Date("2026-09-20T10:00:00Z"),
      featured: false,
      tags: ["GitHub", "Git", "Open Source", "Software Engineering"],
      content: `### Overcoming the Codebase Intimidation Barrier

Opening a production repository with hundreds of thousands of lines of code for the first time is daunting. Many junior developers abandon their intention to contribute because they assume they must understand the entire architecture before fixing a single issue.

In reality, even seasoned maintainers only have localized mental models of specific submodules at any given moment.

---

### Anatomy of a High-Quality First Issue

When starting out, filter issues using GitHub labels:
- \`good first issue\`
- \`help wanted\`
- \`documentation\`
- \`reproduced\`

Before writing code, reproduce the bug locally. Follow the project's development setup guide step-by-step. If you encounter any gaps in the documentation, filing a clarification or submitting a fix to the setup instructions is itself a valuable contribution.

---

### The Clean Pull Request Protocol

Maintainers are volunteers managing competing priorities. The easier you make your pull request to review, the faster it will be merged:

1. **Atomic Commits:** Each commit should represent one logical change with an informative commit message following the Conventional Commits specification (\`feat:\`, \`fix:\`, \`docs:\`, \`refactor:\`).
2. **Include Reproduction Steps & Tests:** State what was broken, how your code resolves it, and provide automated unit or integration tests that prove the fix.
3. **No Unrelated Formatting:** Avoid auto-formatting whole files that introduce hundreds of noisy diff lines unrelated to your change.
4. **Be Responsive to Feedback:** Treat code reviews as a collaborative masterclass. If a maintainer requests changes, address each comment politely and push follow-up commits promptly.

Contributing to open source transforms you from a consumer of developer tools into an active builder of global technology infrastructure.`,
    },
    {
      slug: "building-reliable-student-infrastructure",
      title: "Architecting Student Infrastructure: Why Edge Computing and Static Delivery Matter",
      excerpt:
        "How ACM BIT Mesra approaches architectural simplicity, static generation, and edge hosting to build student platforms that never crash during registrations.",
      category: "Systems",
      authorName: "ACM BIT Mesra Technical Architecture",
      authorRole: "Architecture Wing · ACM BIT Mesra",
      memberId: "mem_systems_wing",
      date: new Date("2026-09-15T10:00:00Z"),
      featured: false,
      tags: ["Architecture", "Edge", "Cloudflare", "Performance"],
      content: `### The Annual Campus Traffic Spike

Every university student society has experienced the dreaded registration crash: an annual hackathon or contest registration opens, hundreds of students load the portal simultaneously, and the server collapses under connection limits.

When building the digital platform for ACM BIT Mesra, we established a strict architectural rule: **eliminate unnecessary servers, minimize client-side JavaScript, and distribute pre-compiled static assets to the edge.**

---

### 1. Static Export First

Static Site Generation (SSG) pre-renders every page into pure HTML, CSS, and minimal JavaScript at build time. When a visitor requests \`/events/hack-a-bit\`, the response is served directly from edge memory without executing server-side database queries or cold-starting Node.js runtime instances.

Advantages:
- **Zero Cold Start:** No waiting for serverless function boots.
- **Immunity to Database Outages:** The content remains available even if backend APIs are temporarily offline.
- **Maximum Security:** There is no vulnerable backend attack surface exposed on public content pages.

---

### 2. Edge Asset Distribution via Cloudflare Workers

By pairing Next.js App Router with Cloudflare Workers static assets, assets are globally cached across hundreds of edge data centers. Whether an alumnus visits from Bengaluru, London, or San Francisco, latency remains sub-50 milliseconds.

---

### 3. Maintainability for Future Student Generations

Student platforms suffer when departing senior teams leave behind complex, undocumented container clusters or bespoke databases. By storing chapter records, team rosters, and events as strictly typed TypeScript data layers in Git, maintenance requires only a single pull request.

Architecture is not about how many cloud services you can assemble—it is about how reliably and sustainably your software serves people.`,
    },
  ];

  for (const a of initialArticles) {
    const postId = `post_${a.slug.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 40)}`;
    const readingTime = calculateReadingTime(a.content);

    const [insertedPost] = await db
      .insert(schema.blogPosts)
      .values({
        id: postId,
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        contentMarkdown: a.content,
        category: a.category,
        status: "PUBLISHED",
        featured: a.featured,
        seoTitle: `${a.title} | ACM BIT Mesra`,
        seoDescription: a.excerpt,
        readingTimeMinutes: readingTime,
        createdBy: a.memberId,
        publishedBy: a.memberId,
        publishedAt: a.date,
        createdAt: a.date,
        updatedAt: a.date,
      })
      .onConflictDoUpdate({
        target: schema.blogPosts.slug,
        set: {
          title: a.title,
          excerpt: a.excerpt,
          contentMarkdown: a.content,
          category: a.category,
          status: "PUBLISHED",
          featured: a.featured,
          readingTimeMinutes: readingTime,
          publishedAt: a.date,
        },
      })
      .returning({ id: schema.blogPosts.id });

    const actualPostId = insertedPost.id;

    // Author snapshot (Historical Role snapshot)
    await db.delete(schema.blogPostAuthors).where(eq(schema.blogPostAuthors.postId, actualPostId));
    await db.insert(schema.blogPostAuthors).values({
      id: `auth_${actualPostId}`,
      postId: actualPostId,
      memberId: a.memberId,
      authorOrder: 0,
      authorNameSnapshot: a.authorName,
      authorRoleSnapshot: a.authorRole,
    });

    // Canonical slug record
    const existingSlug = await db.query.blogPostSlugs.findFirst({
      where: (t, { and, eq }) => and(eq(t.postId, actualPostId), eq(t.slug, a.slug)),
    });
    if (!existingSlug) {
      await db
        .insert(schema.blogPostSlugs)
        .values({
          id: `slug_${actualPostId}_${a.slug.slice(0, 20)}`,
          postId: actualPostId,
          slug: a.slug,
        })
        .onConflictDoNothing();
    }

    // Tags
    for (const tagName of a.tags) {
      const tagSlug = slugify(tagName);
      let tag = await db.query.blogTags.findFirst({
        where: (t, { eq }) => eq(t.slug, tagSlug),
      });

      if (!tag) {
        const [newTag] = await db
          .insert(schema.blogTags)
          .values({
            id: `tag_${tagSlug}`,
            name: tagName,
            slug: tagSlug,
          })
          .returning();
        tag = newTag;
      }

      await db
        .insert(schema.blogPostTags)
        .values({
          id: `pt_${actualPostId}_${tag.id}`,
          postId: actualPostId,
          tagId: tag.id,
        })
        .onConflictDoNothing();
    }
  }

  console.log(`✓ Seeded ${initialArticles.length} production articles into Neon.`);
  console.log("🎉 Seeding completed successfully!");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
