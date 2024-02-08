#!/usr/bin/env bash
set -e

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null)"
STATIC_DIR="${ROOT_DIR:-"/root-dir-not-found"}/static"
JAVASCRIPT_DIRECTORY="${STATIC_DIR}/javascript"
CSS_DIRECTORY="${STATIC_DIR}/css"

function get_latest_release_version() {
  local OWNER="$1"
  local REPO="$2"
  curl -L --silent \
       -H "Accept: application/vnd.github+json" \
       -H "Authorization: Bearer ${GITHUB_TOKEN}" \
       -H "X-GitHub-Api-Version: 2022-11-28" \
       "https://api.github.com/repos/${OWNER}/${REPO}/releases/latest" |
    jq -r '.tag_name' |
    sed 's/^v//g'
}

mkdir -p "${JAVASCRIPT_DIRECTORY}"
mkdir -p "${CSS_DIRECTORY}"

MARKED_VERSION="$(get_latest_release_version "markedjs" "marked")"
echo "marked version: ${MARKED_VERSION}"
curl --silent -o "${JAVASCRIPT_DIRECTORY}/marked.min.js" "https://cdn.jsdelivr.net/npm/marked@${MARKED_VERSION}/marked.min.js"

GITHUB_MARKDOWN_LIGHT_VERSION="$(get_latest_release_version "sindresorhus" "github-markdown-css")"
echo "github-markdown-css version: ${GITHUB_MARKDOWN_LIGHT_VERSION}"
curl --silent -o "${CSS_DIRECTORY}/github-markdown-light.min.css" "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/${GITHUB_MARKDOWN_LIGHT_VERSION}/github-markdown-light.min.css"
curl --silent -o "${CSS_DIRECTORY}/github-markdown-dark.min.css" "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/${GITHUB_MARKDOWN_LIGHT_VERSION}/github-markdown-dark.min.css"

# https://www.jsdelivr.com/package/npm/highlight.js
HIGHLIGHT_JS_VERSION="$(get_latest_release_version "highlightjs" "highlight.js")"
echo "highlight.js version: ${HIGHLIGHT_JS_VERSION}"
curl --silent -o "${JAVASCRIPT_DIRECTORY}/highlight.min.js" "https://cdn.jsdelivr.net/npm/highlight.js@${HIGHLIGHT_JS_VERSION}/lib/index.min.js"
curl --silent -o "${CSS_DIRECTORY}/highlight-github.min.css" "https://cdn.jsdelivr.net/npm/highlight.js@${HIGHLIGHT_JS_VERSION}/styles/github.min.css"

