#!/usr/bin/env pwsh
$ErrorActionPreference = 'Stop'

$stdin = [Console]::OpenStandardInput()
$stdout = [Console]::OpenStandardOutput()

$tool = @{
    name = 'echo'
    description = 'Echo back the provided message'
    inputSchema = @{
        type = 'object'
        properties = @{
            message = @{
                type = 'string'
            }
        }
        required = @('message')
        additionalProperties = $false
    }
}

function Write-McpMessage {
    param(
        [Parameter(Mandatory = $true)]
        [object]$Payload
    )

    $json = $Payload | ConvertTo-Json -Depth 20 -Compress
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
    $header = [System.Text.Encoding]::ASCII.GetBytes("Content-Length: $($bytes.Length)`r`n`r`n")

    $stdout.Write($header, 0, $header.Length)
    $stdout.Write($bytes, 0, $bytes.Length)
    $stdout.Flush()
}

function Read-Byte {
    param(
        [Parameter(Mandatory = $true)]
        [System.IO.Stream]$Stream
    )

    $buffer = New-Object byte[] 1
    $read = $Stream.Read($buffer, 0, 1)
    if ($read -le 0) {
        return $null
    }

    return [int]$buffer[0]
}

function Read-McpMessage {
    $headerBytes = New-Object System.Collections.Generic.List[byte]
    $newlineState = 0

    while ($true) {
        $next = Read-Byte -Stream $stdin
        if ($null -eq $next) {
            return $null
        }

        $headerBytes.Add([byte]$next)

        switch ($newlineState) {
            0 { $newlineState = if ($next -eq 13) { 1 } else { 0 } }
            1 { $newlineState = if ($next -eq 10) { 2 } else { 0 } }
            2 { $newlineState = if ($next -eq 13) { 3 } else { 0 } }
            3 {
                if ($next -eq 10) {
                    break
                }
                $newlineState = 0
            }
        }

        if ($headerBytes.Count -ge 4) {
            $count = $headerBytes.Count
            if ($headerBytes[$count - 4] -eq 13 -and $headerBytes[$count - 3] -eq 10 -and $headerBytes[$count - 2] -eq 13 -and $headerBytes[$count - 1] -eq 10) {
                break
            }
        }
    }

    $headerText = [System.Text.Encoding]::ASCII.GetString($headerBytes.ToArray())
    $contentLength = $null

    foreach ($line in $headerText -split "`r`n") {
        if ($line -match '^Content-Length:\s*(\d+)$') {
            $contentLength = [int]$matches[1]
        }
    }

    if ($null -eq $contentLength) {
        return $null
    }

    $body = New-Object byte[] $contentLength
    $offset = 0
    while ($offset -lt $contentLength) {
        $read = $stdin.Read($body, $offset, $contentLength - $offset)
        if ($read -le 0) {
            return $null
        }
        $offset += $read
    }

    $json = [System.Text.Encoding]::UTF8.GetString($body, 0, $contentLength)
    return $json | ConvertFrom-Json
}

while ($true) {
    $message = Read-McpMessage
    if ($null -eq $message) {
        break
    }

    $method = $message.method
    $id = $message.id

    switch ($method) {
        'initialize' {
            Write-McpMessage @{
                jsonrpc = '2.0'
                id = $id
                result = @{
                    protocolVersion = '2024-11-05'
                    capabilities = @{
                        tools = @{
                            listChanged = $false
                        }
                    }
                    serverInfo = @{
                        name = 'echo-windows'
                        version = '1.0.0'
                    }
                }
            }
        }

        'notifications/initialized' {
        }

        'tools/list' {
            Write-McpMessage @{
                jsonrpc = '2.0'
                id = $id
                result = @{
                    tools = @($tool)
                }
            }
        }

        'tools/call' {
            $toolName = $message.params.name
            $args = $message.params.arguments

            if ($toolName -ne 'echo') {
                Write-McpMessage @{
                    jsonrpc = '2.0'
                    id = $id
                    error = @{
                        code = -32601
                        message = "Unknown tool: $toolName"
                    }
                }
                continue
            }

            $text = ''
            if ($null -ne $args -and $null -ne $args.message) {
                $text = [string]$args.message
            }

            Write-McpMessage @{
                jsonrpc = '2.0'
                id = $id
                result = @{
                    content = @(
                        @{
                            type = 'text'
                            text = $text
                        }
                    )
                    isError = $false
                }
            }
        }

        default {
            if ($null -ne $id) {
                Write-McpMessage @{
                    jsonrpc = '2.0'
                    id = $id
                    error = @{
                        code = -32601
                        message = "Method not found: $method"
                    }
                }
            }
        }
    }
}
