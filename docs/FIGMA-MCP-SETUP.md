# Figma MCP Setup For Codex And Claude

## What Is Happening

This project already has a Figma MCP config for clients that read project-level `.mcp.json`, but the current Codex session does not load MCP from the repo automatically.

The main mismatch is:

- Claude reads the project-level `.mcp.json`
- Codex uses its own installation, plugin system, and user-level config/auth state

That is why Claude can see Figma while this Codex session cannot.

## Verified Local State

### Project-level files

- `.mcp.json` contains a remote Figma MCP entry pointing at `https://mcp.figma.com/mcp`
- `.gitignore` ignores `.mcp.json`
- `.claude/settings.local.json` explicitly allows `mcp__figma__whoami`, `mcp__figma__get_design_context`, and `mcp__figma__get_variable_defs`

### Codex-level files

- `C:\Users\Валерий\.codex\config.toml` now contains both `pencil` and `figma`
- `C:\Users\Валерий\.codex\.tmp\plugins\plugins\figma\` exists, so the Figma plugin payload is already installed locally
- `C:\Users\Валерий\.codex\.tmp\plugins\plugins\figma\.app.json` shows Figma is wired as an app-backed connector, not a repo-local `.mcp.json` config

### Runtime checks

- `codex mcp list` now shows `figma` as `enabled` with `Auth = OAuth`
- MCP resources/templates exposed to this agent are empty

## Root Cause

The current Codex runtime did not consume this repo's `.mcp.json`, and the user-level Codex config was missing a Figma MCP entry.

For Codex, the supported Figma path is the Figma plugin plus account authentication, not the Claude-style project config with `X-Figma-Token`.

This matches Figma's current setup guide for Codex:

- install the Figma plugin in Codex
- authenticate via the Codex Plugins UI
- then start a new Codex session

## What Was Fixed

The following fix has already been applied on this machine:

- added `figma` to `C:\Users\Валерий\.codex\config.toml`
- authenticated the Codex MCP server against Figma with OAuth

Current resulting config:

```toml
[mcp_servers.figma]
url = "https://mcp.figma.com/mcp"
```

## The Correct Fix For Codex

### In Codex UI

1. Open `Plugins` in the upper-left corner of the Codex app.
2. Find `Figma`.
3. If it is not installed yet, click `Install`.
4. If it is installed but not connected, click `Connect`.
5. Complete the browser auth flow and allow access to your Figma account.
6. Start a new Codex session after authentication completes.

Alternative CLI path that also works:

```powershell
codex mcp add figma --url https://mcp.figma.com/mcp
```

If the server advertises OAuth, Codex will start the login flow automatically.

### Why this is the right fix

Figma's official Codex setup flow uses plugin install + OAuth-style account connection. It does not tell you to wire `X-Figma-Token` into `~/.codex/config.toml`.

## Why This Session Still Cannot Use It Immediately

This agent session was started before the Figma MCP server was added and authorized.

MCP availability is determined when the session host starts. Adding a server later fixes future Codex sessions, but it does not hot-inject new tools into an already-running agent session.

## What Not To Do

- Do not assume project `.mcp.json` is enough for Codex.
- Do not copy the Claude token-based config into Codex unless you have verified Codex supports the same auth method for this specific server.
- Do not leave the current Figma token in plaintext if it has been exposed.

## Security Note

The token currently present in `.mcp.json` is stored in plaintext. Rotate it if this file was ever shared, committed, screen-shared, or pasted into logs.

## Relevant Files

See `docs/FIGMA-MCP-FILES.txt`.

## Sources Used

- Figma Help Center: Codex setup flow for the remote Figma MCP server
- Figma Help Center: Figma MCP server overview and supported clients
- Local Codex CLI inspection: `codex mcp list`, `codex mcp add --help`, local plugin/config files
