#!/usr/bin/env bash
set -e

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null)"
STATIC_DIR="${ROOT_DIR:-"/root-dir-not-found"}/static"
JAVASCRIPT_DIRECTORY="${STATIC_DIR}/javascript"
CSS_DIRECTORY="${STATIC_DIR}/css"

mkdir -p "${JAVASCRIPT_DIRECTORY}"
mkdir -p "${CSS_DIRECTORY}"

# https://cdn.jsdelivr.net/npm/marked/
MARKED_VERSION="4.3.0"
curl -o "${JAVASCRIPT_DIRECTORY}/marked.min.js" "https://cdn.jsdelivr.net/npm/marked@${MARKED_VERSION}/marked.min.js"

# https://cdnjs.com/libraries/github-markdown-css
GITHUB_MARKDOWN_LIGHT_VERSION="5.2.0"
curl -o "${CSS_DIRECTORY}/github-markdown-light.min.css" "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/${GITHUB_MARKDOWN_LIGHT_VERSION}/github-markdown-light.min.css"
curl -o "${CSS_DIRECTORY}/github-markdown-dark.min.css" "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/${GITHUB_MARKDOWN_LIGHT_VERSION}/github-markdown-dark.min.css"

# https://www.jsdelivr.com/package/npm/highlight.js
echo "highlight.js resources needs manually download from 'https://highlightjs.org/download/'"
#HIGHLIGHT_JS_VERSION="11.7.0"
#curl -o "${JAVASCRIPT_DIRECTORY}/highlight.min.js" "https://cdn.jsdelivr.net/npm/highlight.js@${HIGHLIGHT_JS_VERSION}/lib/index.min.js"
#curl -o "${CSS_DIRECTORY}/highlight-github.min.css" "https://cdn.jsdelivr.net/npm/highlight.js@${HIGHLIGHT_JS_VERSION}/styles/github.min.css"

