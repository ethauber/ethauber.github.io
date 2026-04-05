#!/usr/bin/env bash
# pr-context-v3.sh — Extract PR feedback into AI-parseable context files.
#
# Improvements over v1:
#   - Fixes cursor pagination (no longer passes string "null" on first page)
#   - Eliminates overlap: bot review summaries (COMMENTED state) no longer
#     duplicate inline thread content across active/resolved files
#   - Groups inline comments by thread (preserves conversation context)
#   - Includes diff hunks for code context on each thread
#   - Strips HTML noise from review content
#   - Structured JSON scoped to unresolved data only
#   - Optional diff inclusion (--no-diff flag)
#   - Thread-level isOutdated / startLine metadata

set -euo pipefail

# ── Usage ──────────────────────────────────────────────────────────────
usage() {
  echo "Usage: $0 <pr-number-or-url> [--no-diff]"
  echo ""
  echo "Options:"
  echo "  --no-diff   Omit the full diff from the active context file"
  echo ""
  echo "Generates three markdown files from a GitHub PR's review feedback:"
  echo "  pr_active_context.md   — unresolved threads + actionable reviews (full)"
  echo "  pr_active_summary.md   — just the feedback, compact (for quick action)"
  echo "  pr_resolved_context.md — resolved threads + approved/dismissed reviews"
  exit 1
}

preflight_check() {
  local missing=0
  local tool

  for tool in gh jq sed awk; do
    if ! command -v "$tool" >/dev/null 2>&1; then
      echo "Error: Required tool '$tool' is not installed or not in PATH." >&2
      missing=1
    fi
  done

  if [ "$missing" -ne 0 ]; then
    echo "Please install the missing dependencies and rerun the script." >&2
    exit 1
  fi

  if ! gh auth status >/dev/null 2>&1; then
    echo "Error: GitHub CLI is not authenticated or lacks required access." >&2
    echo "Run 'gh auth login' and ensure the selected account can access the target PR." >&2
    exit 1
  fi
}

if [ -z "${1:-}" ]; then usage; fi

preflight_check
PR_REF="$1"
shift
INCLUDE_DIFF=true

for arg in "$@"; do
  case "$arg" in
    --no-diff) INCLUDE_DIFF=false ;;
    *) echo "Unknown option: $arg"; usage ;;
  esac
done

ACTIVE_FILE="pr_active_context.md"
SUMMARY_FILE="pr_active_summary.md"
RESOLVED_FILE="pr_resolved_context.md"
TMP_DIR="$(mktemp -d 2>/dev/null || mktemp -d -t pr-context)"
PR_META_FILE="$TMP_DIR/pr_meta.json"
THREADS_FILE="$TMP_DIR/threads.json"
THREADS_RAW_FILE="$TMP_DIR/threads_raw.json"

cleanup() {
  rm -rf "$TMP_DIR"
}

trap cleanup EXIT INT TERM

# ── Resolve PR ─────────────────────────────────────────────────────────
echo "Resolving PR..."
PR_URL=$(gh pr view "$PR_REF" --json url -q .url)

if [ -z "$PR_URL" ]; then
  echo "Error: Failed to resolve PR '$PR_REF'."
  exit 1
fi

OWNER=$(echo "$PR_URL" | awk -F'/' '{print $4}')
REPO=$(echo "$PR_URL" | awk -F'/' '{print $5}')
PR_NUMBER=$(echo "$PR_URL" | awk -F'/' '{print $7}')

echo "PR: $OWNER/$REPO#$PR_NUMBER"

# ── Fetch PR metadata ─────────────────────────────────────────────────
echo "Fetching PR metadata..."
gh pr view "$PR_REF" \
  --json title,body,author,comments,reviews,state,baseRefName,headRefName \
  > "$PR_META_FILE"

# ── Fetch review threads (paginated, with diff hunks) ─────────────────
echo "Fetching review threads..."

QUERY='
query($owner: String!, $repo: String!, $pr: Int!, $cursor: String) {
  repository(owner: $owner, name: $repo) {
    pullRequest(number: $pr) {
      reviewThreads(first: 100, after: $cursor) {
        pageInfo { hasNextPage endCursor }
        nodes {
          id
          isResolved
          isOutdated
          path
          line
          startLine
          comments(first: 100) {
            pageInfo { hasNextPage endCursor }
            nodes {
              author { login }
              body
              path
              line
              startLine
              diffHunk
              createdAt
            }
          }
        }
      }
    }
  }
}
'

COMMENTS_QUERY='
query($threadId: ID!, $cursor: String) {
  node(id: $threadId) {
    ... on PullRequestReviewThread {
      comments(first: 100, after: $cursor) {
        pageInfo { hasNextPage endCursor }
        nodes {
          author { login }
          body
          diffHunk
          createdAt
        }
      }
    }
  }
}
'

: > "$THREADS_RAW_FILE"
HAS_NEXT=true
CURSOR=""
PAGE=0

while [ "$HAS_NEXT" = "true" ]; do
  PAGE=$((PAGE + 1))

  # Only pass cursor after the first page — avoids sending the string "null"
  cursor_args=()
  if [ -n "$CURSOR" ]; then
    cursor_args=(-f cursor="$CURSOR")
  fi

  response=$(gh api graphql \
    -f query="$QUERY" \
    -f owner="$OWNER" \
    -f repo="$REPO" \
    -F pr="$PR_NUMBER" \
    ${cursor_args[@]+"${cursor_args[@]}"})

  echo "$response" \
    | jq '.data.repository.pullRequest.reviewThreads.nodes' \
    >> "$THREADS_RAW_FILE"

  HAS_NEXT=$(echo "$response" \
    | jq -r '.data.repository.pullRequest.reviewThreads.pageInfo.hasNextPage')
  CURSOR=$(echo "$response" \
    | jq -r '.data.repository.pullRequest.reviewThreads.pageInfo.endCursor')

  echo "  page $PAGE fetched (hasNextPage=$HAS_NEXT)"
done

# Merge all pages into a single array (jq -s slurps multiple JSON values)
jq -s 'add // []' "$THREADS_RAW_FILE" > "$THREADS_FILE"
rm -f "$THREADS_RAW_FILE"

# ── Paginate comments within each thread (if > 100 comments) ──────────
TRUNCATED_COUNT=$(jq '[.[] | select(.comments.pageInfo.hasNextPage == true)] | length' "$THREADS_FILE")
if [ "$TRUNCATED_COUNT" -gt 0 ]; then
  echo "  $TRUNCATED_COUNT thread(s) have >100 comments; fetching remaining pages..."

  PATCHED_THREADS_FILE="$TMP_DIR/threads_patched.json"
  cp "$THREADS_FILE" "$PATCHED_THREADS_FILE"

  # Iterate over indices of threads that still have more comment pages
  THREAD_INDICES=$(jq -r 'to_entries[] | select(.value.comments.pageInfo.hasNextPage == true) | .key' "$THREADS_FILE")

  for IDX in $THREAD_INDICES; do
    THREAD_ID=$(jq -r ".[$IDX].id" "$THREADS_FILE")
    COMMENT_CURSOR=$(jq -r ".[$IDX].comments.pageInfo.endCursor" "$THREADS_FILE")
    CPAGE=1

    echo "    thread $THREAD_ID: fetching extra comment page(s)..."

    while [ "$COMMENT_CURSOR" != "null" ] && [ -n "$COMMENT_CURSOR" ]; do
      CPAGE=$((CPAGE + 1))
      cresponse=$(gh api graphql \
        -f query="$COMMENTS_QUERY" \
        -f threadId="$THREAD_ID" \
        -f cursor="$COMMENT_CURSOR")

      NEW_NODES=$(echo "$cresponse" | jq '.data.node.comments.nodes')
      COMMENT_HAS_NEXT=$(echo "$cresponse" | jq -r '.data.node.comments.pageInfo.hasNextPage')
      COMMENT_CURSOR=$(echo "$cresponse" | jq -r '.data.node.comments.pageInfo.endCursor')

      # Append new nodes to the thread's comments.nodes in the patched file
      jq --argjson idx "$IDX" --argjson newNodes "$NEW_NODES" \
        '.[$idx].comments.nodes += $newNodes' \
        "$PATCHED_THREADS_FILE" > "$TMP_DIR/threads_tmp.json"
      mv "$TMP_DIR/threads_tmp.json" "$PATCHED_THREADS_FILE"

      echo "      comment page $CPAGE fetched (hasNextPage=$COMMENT_HAS_NEXT)"
      [ "$COMMENT_HAS_NEXT" = "true" ] || break
    done
  done

  mv "$PATCHED_THREADS_FILE" "$THREADS_FILE"
fi

TOTAL_THREADS=$(jq 'length' "$THREADS_FILE")
echo "  $TOTAL_THREADS total review threads"

# ── Counts (granular) ──────────────────────────────────────────────────
UNRESOLVED_CURRENT=$(jq  '[.[] | select(.isResolved == false and .isOutdated != true)] | length' "$THREADS_FILE")
UNRESOLVED_OUTDATED=$(jq '[.[] | select(.isResolved == false and .isOutdated == true)] | length' "$THREADS_FILE")
UNRESOLVED=$((UNRESOLVED_CURRENT + UNRESOLVED_OUTDATED))
RESOLVED=$(jq '[.[] | select(.isResolved == true)] | length' "$THREADS_FILE")

echo "  $UNRESOLVED_CURRENT unresolved (current)"
echo "  $UNRESOLVED_OUTDATED unresolved (outdated — code has changed, may not apply)"
echo "  $RESOLVED resolved"

# ── Helper: strip common HTML wrapper tags from piped input ────────────
# Avoid removing arbitrary angle-bracket content such as List<T> or a < b.
strip_html() {
  sed -E 's#</?(p|div|span|code|pre|blockquote|ul|ol|li|br)([[:space:]][^>]*)?>##gI'
}

# ── JQ: format a line reference from thread-level path/line/startLine ──
JQ_LINE_REF='
  def line_ref:
    if .startLine != null and .line != null and .startLine != .line
    then " (lines \(.startLine)-\(.line))"
    elif .line != null
    then " (line \(.line))"
    else ""
    end;
'

# ── JQ: render a single thread with grouped comments ──────────────────
JQ_RENDER_THREAD="
$JQ_LINE_REF
. as \$t
| \"### \(.path // \"General\")\" + line_ref
  + (if .isOutdated == true then \"  *(outdated — code may have changed)*\" else \"\" end)
  + \"\\n\"
  + (.comments.nodes
     | to_entries
     | map(
         \"**\" + (.value.author.login // \"unknown\") + \":**\\n\"
         + .value.body + \"\\n\"
         + if .key == 0 and ((.value.diffHunk // \"\") | length) > 0
           then \"\\n<details><summary>Diff context</summary>\\n\\n\`\`\`\`diff\\n\"
                + .value.diffHunk
                + \"\\n\`\`\`\`\\n\\n</details>\\n\"
           else \"\" end
       )
     | join(\"\\n\"))
  + \"\\n---\\n\"
"

# ══════════════════════════════════════════════════════════════════════
#  ACTIVE CONTEXT
# ══════════════════════════════════════════════════════════════════════
echo "Writing $ACTIVE_FILE ..."
: > "$ACTIVE_FILE"

{
  echo "# PR Active Context"
  echo ""

  # ── Metadata ──
  echo "## Metadata"
  echo ""
  jq -r '"- **Title:** \(.title)
- **Author:** \(.author.login)
- **State:** \(.state)
- **Base:** `\(.baseRefName)` ← **Head:** `\(.headRefName)`

## Description

\(.body // "_No description._")
"' "$PR_META_FILE"
  echo ""

  # ── PR-level issue comments (skip bots) ──
  PR_COMMENTS=$(jq '[
    .comments[]?
    | select(
        (
          ((.author.login // "") | test("\\[bot\\]$")) or
          .author.login == "copilot-pull-request-reviewer" or
          .author.login == "github-actions"
        ) | not
      )
  ]' "$PR_META_FILE")

  if [ "$(echo "$PR_COMMENTS" | jq 'length')" -gt 0 ]; then
    echo "## PR Comments"
    echo ""
    echo "$PR_COMMENTS" | jq -r '.[] |
      "### \(.author.login) (\(.createdAt // ""))\n\(.body)\n\n---\n"'
  fi

  # ── Actionable reviews: CHANGES_REQUESTED only ──
  # COMMENTED reviews are skipped because their bodies are bot-generated
  # summaries that duplicate (and overlap with) the inline thread content.
  ACTIONABLE=$(jq '[.reviews[]? | select(.state == "CHANGES_REQUESTED")]' "$PR_META_FILE")

  if [ "$(echo "$ACTIONABLE" | jq 'length')" -gt 0 ]; then
    echo "## Reviews Requesting Changes"
    echo ""
    echo "$ACTIONABLE" | jq -r '.[] |
      "### \(.author.login)\n\(.body // "_See inline comments._")\n\n---\n"' \
      | strip_html
  fi

  # ── Unresolved inline threads: CURRENT (not outdated) ──
  echo "## Unresolved Inline Threads ($UNRESOLVED_CURRENT)"
  echo ""
  echo "> These comments are on current code and need to be addressed."
  echo ""

  if [ "$UNRESOLVED_CURRENT" -gt 0 ]; then
    jq -r "
      [.[] | select(.isResolved == false and .isOutdated != true)]
      | to_entries[]
      | .value | $JQ_RENDER_THREAD
    " "$THREADS_FILE"
  else
    echo "_No unresolved threads on current code._"
    echo ""
  fi

  # ── Unresolved inline threads: OUTDATED ──
  echo "## Unresolved Outdated Threads ($UNRESOLVED_OUTDATED)"
  echo ""
  echo "> These comments are on code that has since changed. The feedback may"
  echo "> no longer apply, or may have been addressed by subsequent commits."
  echo "> GitHub sometimes fails to persist resolution on outdated threads."
  echo ""

  if [ "$UNRESOLVED_OUTDATED" -gt 0 ]; then
    jq -r "
      [.[] | select(.isResolved == false and .isOutdated == true)]
      | to_entries[]
      | .value | $JQ_RENDER_THREAD
    " "$THREADS_FILE"
  else
    echo "_No unresolved outdated threads._"
    echo ""
  fi

  # ── Diff (optional) ──
  if [ "$INCLUDE_DIFF" = true ]; then
    echo "## Diff"
    echo ""
    echo '````diff'
    gh pr diff "$PR_REF"
    echo '````'
  fi

  # ── Structured JSON (unresolved only) ──
  echo ""
  echo "## Structured JSON"
  echo ""
  echo '```json'
  jq -n \
    --slurpfile meta "$PR_META_FILE" \
    --slurpfile threads "$THREADS_FILE" \
    '{
      meta: {
        title:  $meta[0].title,
        author: $meta[0].author.login,
        state:  $meta[0].state,
        base:   $meta[0].baseRefName,
        head:   $meta[0].headRefName,
        body:   $meta[0].body
      },
      unresolved_threads: [
        $threads[0][]
        | select(.isResolved == false)
      ]
    }'
  echo '```'

} >> "$ACTIVE_FILE"

# ══════════════════════════════════════════════════════════════════════
#  ACTIVE SUMMARY (compact — feedback only)
# ══════════════════════════════════════════════════════════════════════

# JQ: minimal thread rendering — file + line + body, no diff hunks
JQ_RENDER_COMPACT="
$JQ_LINE_REF
\"- **\" + (.path // \"General\") + \"**\" + line_ref
  + (if .isOutdated == true then \" *(outdated)*\" else \"\" end)
  + \"\\n\"
  + (.comments.nodes
     | map(
         \"  > \" + (.body | split(\"\\n\") | join(\"\\n  > \")) + \"\\n\"
       )
     | join(\"\\n\"))
  + \"\\n\"
"

echo "Writing $SUMMARY_FILE ..."
: > "$SUMMARY_FILE"

{
  echo "# PR Feedback Summary"
  echo ""
  jq -r '"**\(.title)** by \(.author.login) — \(.state)"' "$PR_META_FILE"
  echo ""

  echo "## Unresolved — Current ($UNRESOLVED_CURRENT)"
  echo ""
  echo "> Action required — these are on current code."
  echo ""

  if [ "$UNRESOLVED_CURRENT" -gt 0 ]; then
    jq -r "
      [.[] | select(.isResolved == false and .isOutdated != true)]
      | to_entries[]
      | .value | $JQ_RENDER_COMPACT
    " "$THREADS_FILE"
  else
    echo "_None._"
    echo ""
  fi

  echo "## Unresolved — Outdated ($UNRESOLVED_OUTDATED)"
  echo ""
  echo "> Code has changed — these may no longer apply."
  echo ""

  if [ "$UNRESOLVED_OUTDATED" -gt 0 ]; then
    jq -r "
      [.[] | select(.isResolved == false and .isOutdated == true)]
      | to_entries[]
      | .value | $JQ_RENDER_COMPACT
    " "$THREADS_FILE"
  else
    echo "_None._"
    echo ""
  fi

} >> "$SUMMARY_FILE"

# ══════════════════════════════════════════════════════════════════════
#  RESOLVED CONTEXT
# ══════════════════════════════════════════════════════════════════════
echo "Writing $RESOLVED_FILE ..."
: > "$RESOLVED_FILE"

{
  echo "# PR Resolved Context"
  echo ""

  # ── Approved + dismissed reviews ──
  CLOSED_REVIEWS=$(jq '[.reviews[]? | select(.state == "APPROVED" or .state == "DISMISSED")]' "$PR_META_FILE")

  if [ "$(echo "$CLOSED_REVIEWS" | jq 'length')" -gt 0 ]; then
    echo "## Closed Reviews"
    echo ""
    echo "$CLOSED_REVIEWS" | jq -r '.[] |
      "### \(.author.login) [\(.state)]\n\(.body // "_No body._")\n\n---\n"' \
      | strip_html
  fi

  # ── Resolved inline threads (grouped by conversation) ──
  echo "## Resolved Inline Threads ($RESOLVED)"
  echo ""

  if [ "$RESOLVED" -gt 0 ]; then
    jq -r "
      [.[] | select(.isResolved == true)]
      | to_entries[]
      | .value | $JQ_RENDER_THREAD
    " "$THREADS_FILE"
  else
    echo "_No resolved threads._"
    echo ""
  fi

} >> "$RESOLVED_FILE"

echo ""
echo "Done."
echo "  Active   → $ACTIVE_FILE  ($UNRESOLVED_CURRENT current + $UNRESOLVED_OUTDATED outdated unresolved)"
echo "  Summary  → $SUMMARY_FILE  (compact feedback only)"
echo "  Resolved → $RESOLVED_FILE ($RESOLVED resolved threads)"
